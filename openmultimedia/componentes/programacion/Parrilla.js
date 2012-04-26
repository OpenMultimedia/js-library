/**
 * @fileoverview Componente "Parrilla de Programación" para mostrar la programación
 * semanal de un medio.
 * @author Alan Reyes (kg.designer@gmail.com)
 */

goog.provide('openmultimedia.componentes.programacion.Parrilla');

goog.require('goog.object');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.style');
goog.require('goog.events');
goog.require('goog.events.EventHandler');

goog.require('goog.debug.ErrorHandler'); //No requerido realmente, sólo para eliminar Warnings del Compilador
goog.require('goog.events.EventTarget'); //No requerido realmente, sólo para eliminar Warnings del Compilador

goog.require('openmultimedia.api');
goog.require('openmultimedia.api.ManejadorApi');
goog.require('openmultimedia.componentes.programacion.ParrillaTemplates');

/**
 * Controlador de la Parrilla de Programación.
 * @param {Element|string} nodo El nodo o id donde se insertará la Parrilla
 * @param {openmultimedia.Medio} medio La definición JSON del Medio/Canal del cual se mostrará la Parrilla
 * @param {Object.<string, boolean>} regiones Mapa de regiones válidas para mostrar su información de Horario en la Parrilla. La llave del mapa son las siglas de la región, mientras el valor es un booleano que define si es válido y se mostrará o no.
 * @param {Object} localizacion Mapa de cadenas localizadas que se utilizará en la Parrilla
 * @param {openmultimedia.componentes.programacion.Parrilla.ParrillaConfig} defaultOptions Opciones por default
 * @constructor
 */
openmultimedia.componentes.programacion.Parrilla = function(nodo, manejadorApi, regiones, localizacion, defaultOptions) {
  goog.DEBUG && console.log('Parrilla.constructor');

  // Configuración
  this.nodo_ = goog.dom.getElement(nodo);
  this.tablaSemana_ = null;
  this.tablaProgramacionHeader_ = null;
  this.contenedorProgramacion_ = null;
  this.tablaProgramacion_ = null;

  this.api_ = manejadorApi;

  this.regiones_ = regiones;
  this.localizacion_ = localizacion;
  this.defaultOptions_ = defaultOptions;
  this.diasOrden_ = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  this.options_ = {};

  // Controles
  this.manejadorProgramas_ = null;
  this.botonesSemana_ = {};
  this.diaSeleccionado_ = null;

  this.idEmisionActual_ = null;
  this.estadoTransmisionTimeoutId_ = null;

  //Public?

  this.setOptions_ = function(userOptions) {
    goog.DEBUG && console.log('Parrilla.setOptions');
    var options = {};
    goog.object.extend(options, this.defaultOptions_, userOptions);

    if ( ! options['lang'] in this.localizacion_ ) {
      options['lang'] = this.defaultOptions_['lang'];
    }

    if ( ! options['region-principal'] in this.regiones_ ) {
      options['region-principal'] = this.defaultOptions_['region-principal'];
    }

    if ( openmultimedia.componentes.programacion.Parrilla.utils.getIdDia(options['dia-inicial']) < 0 ) {
      options['dia-inicial'] = this.defaultOptions_['dia-inicial'];
    }

    if ( openmultimedia.componentes.programacion.Parrilla.utils.getIdDia(options['dia-seleccionado']) < 0 ) {
      if ( options['dia-seleccionado'] == 'hoy') {
        options['dia-seleccionado'] = openmultimedia.componentes.programacion.Parrilla.utils.getSlugDia((new Date()).getDay());
      } else {
        options['dia-seleccionado'] = openmultimedia.componentes.programacion.Parrilla.utils.getSlugDia((new Date()).getDay());
      }
    }

    if ( ! options['mostrar-hora-final'] in {'todos': true, 'principal': true, 'ninguno': true} ) {
      options['mostrar-hora-final'] = this.defaultOptions_['principal'];
    }

    goog.DEBUG && console.log('Opciones set', userOptions, options);
    this.options_ = options;
  }


  this.init = function(opt_options) {
    goog.DEBUG && console.log('Parrilla.init');

    var userOptions = (opt_options && (opt_options instanceof Object)) ? opt_options: {};

    this.setOptions_(opt_options);

    var lang = this.options_['lang'];

    goog.dom.classes.add(this.nodo_, goog.getCssName('openmultimedia-componentes-parrilla'));

    this.crearContenedor_();

    this.tablaSemana_ = goog.dom.getElementByClass( goog.getCssName('openmultimedia-componentes-parrilla-semana'), this.nodo_);
    this.tablaProgramacionHeader_ = goog.dom.getElementByClass( goog.getCssName('openmultimedia-componentes-parrilla-programacion-header'), this.nodo_);
    this.contenedorProgramacion_ = goog.dom.getElementByClass( goog.getCssName('openmultimedia-componentes-parrilla-programacion-contenedor'), this.nodo_);

    this.recargarProgramas();
    this.recargarProgramacion();
    this.seleccionar(this.options_['dia-seleccionado']);

    if ( this.options_['mostrar-estado-transmision'] in {'solo-en-vivo': true, 'ambos': true} ) {
      this.verificarEstadoTransmision();
    }
  }

  this.onCargarTransmisionActual_ = function(data) {
    goog.DEBUG && console.log("Transmision actual es:", data);
    var nodo;
    var idEmision = data['emision_id'];

    if ( idEmision !== this.idEmisionActual_  ) {
      this.idEmisionActual_ = idEmision;
      this.redraw();
    }

    this.estadoTransmisionTimeoutId_ = (function(parrilla) {
      return setTimeout(function() { parrilla.verificarEstadoTransmision(); }, (goog.DEBUG ? 60 * 1000 : 5 * 60 * 1000));
    })(this);
  }

  this.verificarEstadoTransmision = function() {
    goog.DEBUG && console.log("Verificando estado");
    this.api_.loadProgramacionAhora({}, goog.bind(this.onCargarTransmisionActual_, this));
  }

  this.onLoadProgramas_ = function(data) {
    this.manejadorProgramas_ = new openmultimedia.componentes.programacion.Parrilla.ManejadorDatos(data, 'creatv_id');
    this.redraw();
  }

  this.onLoadProgramacion_ = function(data) {
    this.programacion_ = data;
    this.redraw();
  }

  this.recargarProgramas = function() {
    this.api_.loadProgramas({}, goog.bind(this.onLoadProgramas_, this));
  }

  this.recargarProgramacion = function() {
    this.api_.loadProgramacionSemanal({}, goog.bind(this.onLoadProgramacion_, this));
  }

  this.crearContenedor_ = function() {
     var templateData = {};
    templateData.localizacion = this.localizacion_[this.options_['lang']];

    var i;

    var diaInicial = openmultimedia.componentes.programacion.Parrilla.utils.getIdDia( this.options_['dia-inicial'] );

    templateData.dias = [];

    for ( i = 0; i < 7; i ++ ) {
      var diaRecorrido = i + diaInicial;
      templateData.dias[i] = openmultimedia.componentes.programacion.Parrilla.utils.getSlugDia( diaRecorrido >= 7 ? diaRecorrido - 7: diaRecorrido );
    }

    var contenedor = openmultimedia.componentes.programacion.ParrillaTemplates.contenedor(templateData);
    var contenedorNode = goog.dom.htmlToDocumentFragment(contenedor);

    goog.DEBUG && console.log("DocFrag", contenedorNode);

    goog.dom.append(this.nodo_, contenedorNode);

    goog.DEBUG && console.log("DocFragAppended", contenedorNode, goog.dom.isElement(contenedorNode));

    var diasCells = goog.dom.getElementsByClass(goog.getCssName('openmultimedia-componentes-parrilla-semana-dia'), goog.dom.isElement(contenedorNode) ? (/** @type {Element} */ contenedorNode) : this.nodo_[0]);

    for ( i = 0; i < 7; i += 1 ) {
      var handler = new openmultimedia.componentes.programacion.Parrilla.SeleccionDiaEventHandler(this, templateData.dias[i]);
      handler.listen(diasCells[i], 'click');
      this.botonesSemana_[ templateData.dias[i] ] = diasCells[i];
    }
  }

  this.redraw = function() {
    if ( ! this.programacion_ ) {
      return;
    }

    var lang = this.options_['lang'];
    var pais = this.options_['region-principal'];
    var mostrarHoraFinal = this.options_['mostrar-hora-final'];

    if ( ! this.contenedorProgramacion_ ) {
      return;
    }

    goog.dom.removeChildren( this.contenedorProgramacion_ );

    goog.DEBUG && console.log(this.botonesSemana_);
    goog.DEBUG && console.log(this.diaSeleccionado_);

    if ( ! this.diaSeleccionado_ ) {
      return;
    }

    goog.dom.classes.add(this.botonesSemana_[this.diaSeleccionado_], goog.getCssName('openmultimedia-componentes-parrilla-semana-seleccionado'));

    this.nodosPorTransmision_ = {};

    var data = this.programacion_[this.diaSeleccionado_];

    var templateData = {
      programacion: [],
      pais: pais,
      regiones: [],
      localizacion: this.localizacion_[lang],
      mostrarHoraFinal: mostrarHoraFinal
    };

    var region;
    for (region in this.regiones_) {
      if ( region != pais ) {
        templateData.regiones.push(region);
      }
    }

    for ( var i = 0; i < data.length; i ++ ) {
      var dataUnit = {};

      if ( ! openmultimedia.componentes.programacion.Parrilla.utils.tieneFormatoValidoHora(data[i]["hora"][pais]) ) {
          continue;
      }

      var hDiff = openmultimedia.componentes.programacion.Parrilla.utils.diferenciaHoras(data[i]["hora"][pais], data[i]["hora_final"][pais]);
      hDiff[1] += 1;

      var hFinal = openmultimedia.componentes.programacion.Parrilla.utils.sumaHoras(data[i]["hora"][pais], hDiff);

      dataUnit.hora  = {};
      dataUnit.hora[pais] = {inicio: data[i]["hora"][pais], fin: hFinal };

        var izq = true;
        for ( var vpais in this.regiones_ ) {
          if ( ! this.regiones_[vpais] ) {
            continue;
          }

          if ( vpais != pais && data[i]["hora"][vpais] ) {
            hFinal = openmultimedia.componentes.programacion.Parrilla.utils.sumaHoras(data[i]["hora"][vpais], hDiff);
            dataUnit.hora[vpais] = {inicio: data[i]["hora"][vpais], fin: hFinal };
          }
        }

        var progId = data[i].id;
        var progObj = this.manejadorProgramas_ ? this.manejadorProgramas_.get(progId) : null;
        if ( progObj ) {
          dataUnit.programa = {
            nombre: progObj['nombre'],
            imagen_url: progObj['imagen_url'],
            descripcion: progObj['descripcion']
          }
        } else {
          dataUnit.programa = {
            nombre: data[i]['nombre'],
            imagen_url: '',
            descripcion: ''
          }
        }

        if ( data[i]['emision_id'] === this.idEmisionActual_ ) {
          dataUnit.emision = {id: data[i]['emision_id'], estado: 'en-vivo', url: this.URLS_.en_vivo};
          //this.cambiarEstadoTransmisionNodo_(node,'en-vivo');
        } else if ( data[i]['emision_id'] < this.idEmisionActual_ ) {
          dataUnit.emision = {id: data[i]['emision_id'], estado: 'grabado', url: ''};
        } else {
          dataUnit.emision = {id: data[i]['emision_id'], estado: 'programado', url: ''};
        }

        templateData.programacion.push(dataUnit);
      }

      goog.DEBUG && console.log("Template Data", templateData);

      var node = goog.dom.htmlToDocumentFragment( openmultimedia.componentes.programacion.ParrillaTemplates.tablaProgramacion(templateData) );

      goog.dom.append(this.contenedorProgramacion_, node);

      this.tablaProgramacion_ = goog.dom.getElementByClass( goog.getCssName('openmultimedia-componentes-parrilla-programacion-contenido'), this.contenedorProgramacion_);

      if ( this.options_["scroll"] ) {
        goog.DEBUG && console.log("Redraw: Scrolling");

        var nodeSize = goog.style.getSize(this.nodo_);
        var semanaSize = goog.style.getSize(this.tablaSemana_);
        var headerSize = goog.style.getSize(this.tablaProgramacionHeader_);
        var contentSize = goog.style.getSize(this.tablaProgramacion_);

        var tmpHeight = nodeSize.height - (semanaSize.height + headerSize.height);

        goog.style.setHeight(this.contenedorProgramacion_, tmpHeight - 1);

        if( 'scrollTop' in this.contenedorProgramacion_ ) {
          var itemEnVivo = goog.dom.getElementByClass(goog.getCssName('openmultimedia-componentes-parrilla-item-en-vivo'), this.tablaProgramacion_);

          if ( itemEnVivo ) {
            var ievPosition = goog.style.getRelativePosition(itemEnVivo, this.tablaProgramacion_);
            this.contenedorProgramacion_.scrollTop = ievPosition.y;
          } else {
            this.contenedorProgramacion_.scrollTop = 0;
          }
        }

        goog.style.setWidth(this.tablaSemana_, contentSize.width);
        goog.style.setWidth(this.tablaProgramacionHeader_, contentSize.width);
      }
  }

  this.seleccionar = function(dia) {
    // Si el dia seleccionado no es válido o es el que ya está seleccionado, no hace nada
    if ( openmultimedia.componentes.programacion.Parrilla.utils.getIdDia(dia) < 0 || dia == this.diaSeleccionado_ ) {
      return;
    }

    if ( this.diaSeleccionado_ ) {
      goog.dom.classes.remove(this.botonesSemana_[this.diaSeleccionado_], goog.getCssName('openmultimedia-componentes-parrilla-semana-seleccionado'));
    }

    this.diaSeleccionado_ = dia;
    this.redraw();
  }
}

openmultimedia.componentes.programacion.Parrilla.prototype.URLS_ = {};

openmultimedia.componentes.programacion.Parrilla.DIAS_POR_SLUG = {
  'domingo': 0,
  'lunes': 1,
  'martes': 2,
  'miercoles': 3,
  'jueves': 4,
  'viernes': 5,
  'sabado': 6
}

openmultimedia.componentes.programacion.Parrilla.DIAS_POR_ID = {
  '0': 'domingo',
  '1': 'lunes',
  '2': 'martes',
  '3': 'miercoles',
  '4': 'jueves',
  '5': 'viernes',
  '6': 'sabado'
};

//Solitiud del namespace
goog.provide('openmultimedia.componentes.programacion.Parrilla.utils');

openmultimedia.componentes.programacion.Parrilla.utils.getIdDia = function(slugDia) {
  return (slugDia in openmultimedia.componentes.programacion.Parrilla.DIAS_POR_SLUG ? openmultimedia.componentes.programacion.Parrilla.DIAS_POR_SLUG[slugDia] : -1);
}

openmultimedia.componentes.programacion.Parrilla.utils.getSlugDia = function(idDia) {
  return (idDia in openmultimedia.componentes.programacion.Parrilla.DIAS_POR_ID ? openmultimedia.componentes.programacion.Parrilla.DIAS_POR_ID[idDia] : '');
}

openmultimedia.componentes.programacion.Parrilla.utils.tieneFormatoValidoHora = function(hora) {
  return /^\d{2}:\d{2}$/.test(hora);
}

openmultimedia.componentes.programacion.Parrilla.utils.diferenciaHoras = function(horaInicial, horaFinal) {
    if ( typeof(horaFinal) == "string" ) {
        horaFinal = horaFinal.split(":");
    }

    if ( typeof(horaInicial) == "string" ) {
        horaInicial = horaInicial.split(":");
    }

    return [  parseInt(horaFinal[0],10) - parseInt(horaInicial[0],10), parseInt(horaFinal[1],10) - parseInt(horaInicial[1],10) ];
}

openmultimedia.componentes.programacion.Parrilla.utils.sumaHoras = function(horaInicial, diferencia) {
  if ( typeof horaInicial === "string" ) {
      horaInicial = horaInicial.split(":");
  }
  var hFinal = [ parseInt(horaInicial[0],10) + parseInt(diferencia[0],10), parseInt(horaInicial[1],10) + parseInt(diferencia[1],10) ];

  if ( hFinal[1] >= 60 ) {
      var horasExtra = Math.floor(hFinal[1] / 60);
      hFinal[1] -= 60 * horasExtra;
      hFinal[0] += horasExtra;
      if ( hFinal[0] >= 24 ) {
          hFinal[0] -= 24;
      }
  }
  return ( ( hFinal[0] < 10 ? "0" : "" ) + hFinal[0].toString() + ":" + ( hFinal[1] < 10 ? "0" : "" ) + hFinal[1].toString() );
}


/**
 * Manejador de Datos
 * @constructor
 */
openmultimedia.componentes.programacion.Parrilla.ManejadorDatos = function(listaDatos, orderKey) {
  this.datos_ = {};
  var i;

  for ( i = 0; i < listaDatos.length; i ++ ) {
    this.datos_[ listaDatos[i][orderKey] ] = listaDatos[i];
  }
}

openmultimedia.componentes.programacion.Parrilla.ManejadorDatos.prototype.get = function (id) {
  return ( this.datos_[id] || null );
}

/**
 * Manejador del Evento cuando se selecciona un día de la semana
 * @constructor
 * @param {openmultimedia.componentes.programacion.Parrilla} parrilla La parrilla asociada a este manejador
 * @param {string} dia Clave del dia asociado a este manejador (lunes, martes, miercoles...)
 * @param {Object=} opt_handler Objeto contexto para ejecutar las funciones handler
 * @extends {goog.events.EventHandler}
 */
openmultimedia.componentes.programacion.Parrilla.SeleccionDiaEventHandler = function(parrilla, dia, opt_handler) {
  /**
   * La Parrilla asociada a este Manejador de Evento
   * @type {openmultimedia.componentes.programacion.Parrilla}
   */
  this.parrilla = parrilla;
  this.dia = dia;
  goog.events.EventHandler.apply(this, [opt_handler]);
}

goog.inherits(openmultimedia.componentes.programacion.Parrilla.SeleccionDiaEventHandler, goog.events.EventHandler);

openmultimedia.componentes.programacion.Parrilla.SeleccionDiaEventHandler.prototype.handleEvent = function(e) {
  this.parrilla.seleccionar(this.dia);
}

// Tipos de dato

/**
 * Objecto de configuración de la parrilla de programación.
 * El formato queda discutido y documentado en:
 * https://gist.github.com/efcf6bcbc193968d7ca7#file_openmultimedia.componentes.programacion.Parrilla.parrilla_config.json
 * @typedef {{lang: string, region-principal: string, dia-inicial: string, dia-seleccionado: string, mostrar-hora-final: string, mostrar-estado-transmision: string, scroll: boolean}}
 */
openmultimedia.componentes.programacion.Parrilla.Config;