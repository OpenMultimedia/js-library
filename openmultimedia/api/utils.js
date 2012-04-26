goog.provide('openmultimedia.api.utils');

goog.require('openmultimedia.api');

openmultimedia.api.utils.LOCALIZATION = {
  'es': {
    formatos: {
       fecha: '{dia-semana} {dia} de {mes}, {año}'
    },
    dias: [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ],
    meses: [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ]
  },
  'en': {
    formatos: {
       fecha: '{dia-semana} {mes} {dia}, {año}'
    },
    dias: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
    meses: [ 'january', 'february', 'march', 'april', 'may', 'june',
       'july', 'august', 'september', 'october', 'november', 'december' ]
  },
  'pt': {
    formatos: {
       fecha: '{dia-semana} {dia} de {mes}, {año}'
    },
    dias: [ 'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado' ],
    meses: [ 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro' ]
  }
}

openmultimedia.api.utils.formatPlace = function (dataItem) {
  var etiqueta = '';
  var ciudad = dataItem['ciudad'];
  var pais = dataItem['pais'];

  if ( ciudad || pais ) {
    if ( pais && pais['nombre'] ) {
      etiqueta = (ciudad ? ciudad + ', ': '') + pais['nombre'];
    } else if ( ciudad ) {
      etiqueta = ciudad;
    }
  }
  return etiqueta;
}

openmultimedia.api.utils.formatDateTime = function (dateString, lang) {
  var localization = openmultimedia.api.utils.LOCALIZATION[lang];

  var strFecha = null;

  var fechaPieces = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(dateString);
  if ( fechaPieces ) {
    var fechaJS = new Date(fechaPieces[1], fechaPieces[2] - 1, fechaPieces[3], fechaPieces[4], fechaPieces[5], fechaPieces[6]);

    var replaces = {
      'dia-semana': localization.dias[fechaJS.getDay()],
      'dia': fechaJS.getDate(),
      'mes': localization.meses[fechaJS.getMonth()],
      'año': fechaJS.getFullYear()
    };

    strFecha = localization.formatos.fecha;

    for ( var key in replaces ) {
      strFecha = strFecha.replace('{' + key + '}', replaces[key]);
    }
  }

  return strFecha;
};

openmultimedia.api.utils.formatDatePlace = function(dataItem, lang) {

  var strFecha = openmultimedia.api.utils.formatDateTime(dataItem['fecha'], lang);

  var strLugar = openmultimedia.api.utils.formatPlace(dataItem);

  if ( strFecha && strLugar ) {
    return strFecha + ' | ' + strLugar;
  }

  return strFecha || strLugar || '';
}

openmultimedia.api.utils.clipEsDeTipo = function (itemData, tipo) {
  return itemData['tipo'] && (itemData['tipo']['slug'] == tipo);
}