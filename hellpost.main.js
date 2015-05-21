var FuncionesEcons;
var global;
FuncionesEcons = function () {

	/*
	 v 0.9.3
	 corrected faults
	 No data available on table
	 Datos {Array} //parametros que mandas atravez de post
	 Funcion {Function} // Function que se ejecuta al terminar el post
	 Acepta parametro Null para ejecutar predeterminada
	 cols {Array} Columnas que carga de manera predeterminada  Funcion debe ser null
	 SPECIAL THANKS BETOflAKES TO INTEGRATE PACE
	 */
	/*
	 *                 COLS
	 *    | COLUMN HTML | COLUMN DB |
	 *    ---------------------------
	 * */
	this.updateButton = $("#btnOpt1");
	this.tableDump = $("#btnOpt1");
	this.disableFilter = false;
	this.actions = function (btn) {
		this.updateButton = btn;
	};
	this.disableFilterF = function () {
		this.disableFilter = true;
	};
	this.enableFilterF = function () {
		this.disableFilter = false;
	};
	this.hellPost = function (datos, funcion, cols) {
		var updateButton = this.updateButton;
		var disableFilter = this.disableFilter;
		star_loader();
		Pace.restart();//Inicia Pace cuando se mande algo

		if (arguments.length == 0) {
			console.error("Hey man what do you mean? i need a fuck variable");
		}
		else if (arguments.length == 1) {
			/*            if(this.validateMan()){
			 alertify.alert("Some Wrong Data, see the console if u are a developer!");
			 end_loader();
			 return false;

			 }*/
			$.ajax({
				url     : '/bin/queries.php',
				type    : 'POST',
				dataType: 'json',
				async   : true,
				data    : datos,
				success : function (data) {
					if (data) {
						alertify.success("Se realizo correctamente!");
					} else {
						alertify.error("hubo un problema!");

					}
					end_loader();
					updateButton.trigger("click");
				}
			});
		}
		else if (arguments.length == 2) {
			if (funcion == null) {
				console.log("Hey man you dont need pass me a null param try this hellpost(datos) only an argument is possibly!");
				$.ajax({
					url     : '/bin/queries.php',
					type    : 'POST',
					dataType: 'json',
					async   : true,
					data    : datos,
					success : function (data) {
						if (data) {
							alertify.success("Se realizo correctamente!");
						} else {
							alertify.error("hubo un problema!");
						}
						end_loader();
						updateButton.trigger("click");

					}
				});
			}
			else {
				if (typeof (funcion) == "function") {
					$.ajax({
						url     : '/bin/queries.php',
						type    : 'POST',
						dataType: 'json',
						async   : true,
						data    : datos,
						success : funcion
					});
				} else {
					console.error("it's not a function this->" + funcion);
				}
			}
		}
		else if (arguments.length == 3) {
			if (cols != null) {
				if (typeof(cols) == "object") {
					$.ajax({
						url     : '/bin/queries.php',
						type    : 'POST',
						dataType: 'json',
						async   : false,
						data    : datos,
						xhr     : function () {
							var xhr = new window.XMLHttpRequest();
							//Upload progress
							xhr.upload.addEventListener("progress", function (evt) {
								if (evt.lengthComputable) {
									var percentComplete = evt.loaded / evt.total;
									//Do something with upload progress
									//console.log(percentComplete);
								}
							}, false);
							//Download progress
							xhr.addEventListener("progress", function (evt) {
								if (evt.lengthComputable) {
									var percentComplete = evt.loaded / evt.total;
									//Do something with download progress
									//console.log(percentComplete);
								}
							}, false);
							return xhr;
						},
						success : function (data) {
							if (data) {
								//Titulos de la tabla
								res = "<thead><tr>";
								for (var i = 0; i < cols.length; i++) {
									var columnsh = Object.keys(cols[i]);
									if ((columnsh != "" && columnsh != "funciones")) {
										// console.log(columnsh[0]);
										//console.log(columnsh[0].indexOf("<table>"));
										if (columnsh[0].indexOf("table") > -1 || columnsh[0].indexOf("div") > -1) {
											var html = $.parseHTML(columnsh[0]);
											console.log(html);
											var colspan = $(html).attr("data-colspanparent");
											console.log(colspan);
											res += "<th colspan='" + colspan + "'>" + columnsh + " </th>";

										}
										else
											res += "<th>" + columnsh + " </th>";
									}

								}
								res += "<th>Funciones</th>";
								res += "</thead></tr>";
								res += "<tfoot><tr>";
								//Pie de la tabla
								for (var i = 0; i < cols.length; i++) {
									var columnsf = Object.keys(cols[i]);
									if ((columnsf != "" && columnsf != "funciones")) {
										/*console.log(columnsf[0]);
										 console.log(columnsf[0].indexOf("<table>"));*/
										if (columnsf[0].indexOf("table") > -1 || columnsf[0].indexOf("div") > -1) {
											var html = $.parseHTML(columnsf[0]);
											console.log(html);
											var colspan = $(html).attr("data-colspanparent");
											console.log(colspan);
											res += "<th colspan='" + colspan + "'>" + columnsf + " </th>";

										}
										else
											res += "<th>" + columnsf + " </th>";
									}
								}
								res += "<th>Funciones</th>";
								res += "</tr></tfoot>";
								//Cuerpo de la tabla
								res += "<tbody>";
								var variables = "";                 //Variables se inyectan en los botones de funciones
								for (var i = 0; i < data.length; i++) {
									variables = "";
									for (var h = 0; h < Object.keys(data[i]).length; h++) {
										variables += 'data-' + Object.keys(data[i])[h] + '="' + data[i][Object.keys(data[i])[h]] + '"';//Crea datas para inyectar al boton
									}
									res += "<tr>";
									for (var j = 0; j < cols.length; j++) {
										var nombre = Object.keys(cols[j]);
										if (nombre == "funciones") { //Extrae los botones que se mandan
											global = cols[j][nombre];
											res += "<td>";
											for (var k = 0; k < cols[j][nombre].length; k++) {          //Se recorren todos los botones para crearlos
												var namebutton = Object.keys(global[k])[0];
												var iconbuton = global[k][namebutton];
												res += '<span class="btnEditTable" ' + variables + '   id="fontButton2" ' + namebutton + '  >&#x' + iconbuton + ';</span>';
											}
											res += "</td>";
										} else {
											var columns = cols[j][nombre];
											res += "<td>" + data[i][columns] + "</td>";
										}

									}
									res += "</tr>";
								}
								res += "</tbody>";
								$('.superTable').html(res);
								//FILTRAR TABLAS
								if (!$.fn.dataTable.isDataTable('.superTable')) {
									if (disableFilter)
										$('.superTable').dataTable({"bSortable": false, ordering: false});
									else
										$('.superTable').dataTable({
											"bSortable": false,
											ordering   : false
										}).columnFilter({sPlaceHolder: "head:after"});
								}

								$('#superTable_previous').html('<');
								$('#superTable_next').html('>');
							} else {

								res = "<thead><tr>";
								for (var i = 0; i < cols.length; i++) {
									var columnsh = Object.keys(cols[i]);
									if (columnsh != "funciones")
										res += "<th>" + columnsh + " &#xF094;</th>";
								}
								res += "<th>Funciones</th>";
								res += "</thead></tr>";
								res += "<tfoot><tr>";
								//Pie de la tabla
								for (var i = 0; i < cols.length; i++) {
									var columnsf = Object.keys(cols[i]);
									if (columnsf != "funciones")
										res += "<th>" + columnsf + "</th>";
								}
								res += "<th>Funciones</th>";
								res += "</tr></tfoot>";
								//Cuerpo de la tabla
								res += "<tbody>";
								var variables = "";                 //Variables se inyectan en los botones de funciones
								for (var i = 0; i < data.length; i++) {
									variables = "";
									for (var h = 0; h < Object.keys(data[i]).length; h++) {
										variables += 'data-' + Object.keys(data[i])[h] + '="' + data[i][Object.keys(data[i])[h]] + '"';//Crea datas para inyectar al boton
									}
									res += "<tr>";
									for (var j = 0; j < cols.length; j++) {
										var nombre = Object.keys(cols[j]);
										if (nombre == "funciones") { //Extrae los botones que se mandan
											global = cols[j][nombre];
											res += "<td>";
											for (var k = 0; k < cols[j][nombre].length; k++) {          //Se recorren todos los botones para crearlos
												var namebutton = Object.keys(global[k])[0];
												var iconbuton = global[k][namebutton];
												res += '<span class="btnEditTable" ' + variables + '   id="fontButton2" ' + namebutton + '  >&#x' + iconbuton + ';</span>';
											}
											res += "</td>";
										} else {
											var columns = cols[j][nombre];
											res += "<td>" + data[i][columns] + "</td>";
										}

									}
									res += "</tr>";
								}
								res += "</tbody>";
								$('.superTable').html(res);
								//FILTRAR TABLAS
								if (disableFilter)
									$('.superTable').dataTable({"bSortable": false, ordering: false});
								else
									$('.superTable').dataTable({
										"bSortable": false,
										ordering   : false
									}).columnFilter({sPlaceHolder: "head:after"});
								$('#superTable_previous').html('<');
								$('#superTable_next').html('>');
							}
							end_loader();

						}
					});
				} else {
					console.error("what fucking u send me, do you try crash me man?");

				}
			} else {
				console.error("null man? are u idiot? put the fucking array here and try again");

			}

		}
	};
	/**
	 * Class {String} // Parametro tipo string que indica el nombre de la clase
	 * accion {String} // Parametro tipo string que indica accion
	 */

	this.dumpMyClass = function (Class, accion) {

		arreglo = {};
		arreglo['a'] = accion;
		var clases = $("." + Class);
		for (var i = 0; i < clases.length; i++) {
			var clase = $(clases[i]);
			var name = clase.attr("name");
			if (clase.hasClass('required')) {
				var typeDato = $(clases[i]).attr('data-typeDato');
				if (this.checkTipo(typeDato, clase)) {
					clase.css("border-color", "red");
					clase.focusin();
					//arreglo.push(clase);
					return false;

				} else {
					clase.css("border", "1px solid #006086");

				}
			}
			arreglo[name] = $(clases[i]).val();
		}
		return arreglo;

	};
	/*
	 usa la clase required para ser validado
	 */
	this.validateMan = function (claseR) {

		arreglo = [];
		var clases = $(".required");
		for (var i = 0; i < clases.length; i++) {

			var clase = $(clases[i]);
			var typeData = clase.attr("data-typeData");

			if (clase.hasClass(claseR))

				if (this.checkTipo(typeData, clase)) {
					clase.css("border", "1px solid #006086");
				} else {
					clase.css("border-color", "red");
					clase.focusin();
					arreglo.push(clase);
				}

		}
		console.log(arreglo);
		return (arreglo.length) ? true : false;
	};
	this.checkTipo = function (tipoDato, obj) {
		if (tipoDato === 'Email' || tipoDato === 'email') {
			return re.test(obj.val());
		} else if (tipoDato === 'Telefono' || tipoDato === 'telefono') {
			var re;
			if (obj.val().length < 10)return false;
			re = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
			return (re.test(obj.val()));
		} else if (tipoDato === 'IMEI' || tipoDato === 'imei') {
			return (obj.val().length != 15);
		}

	};


};
//this.enLetras = function(){
//
//    this.void = "";
//    this.SP = "";
//    this.Dot = ".";
//    this.Zero = "0";
//    this.Neg = "Menos";
//
//    this.valorEnLetras = function(x,Moneda){
//        var s = "";
//        var Ent = "";
//        var Frc = "";
//        var Signo = "";
//        if(parseFloat(x)<0){
//            Signo = this.Neg + " ";
//        }else{
//            Signo = "";
//        }
//        s = x.toFixed(2);
//        if(s.indexOf(this.Dot==-1)){
//            Ent = s;
//            Frc = this.void;
//
//        }else{
//            Ent =
//
//        }
//    }
//
//};
