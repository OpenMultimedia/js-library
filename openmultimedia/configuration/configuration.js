goog.provide('openmultimedia.configuration');

goog.require('goog.object');

/**
 * Completa el objeto de configuración parcial rellenando los valores no indicados con
 * los valores de la configuración base. No es recursivo.
 * @param {Object} partialOptions El objeto de configuración parcial que se va a rellenar
 * @param {Object} baseOptions El objeto de configuración con el que se rellenarán las
 *     opciones faltantes del objeto de configuracion parcial
 * @return {Object} Una copia de el objeto de configuración rellenado. Se devolverá
 *     el objeto {@code baseOptions} en caso de que partialOptions no sea un objeto
 *     de configuración válido
 */
openmultimedia.configuration.complete = function (partialOptions, baseOptions) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.configuration.complete');

  goog.DEBUG && console.info('Arguments: ', arguments);

  var fullOptions;

  if ( typeof partialOptions == 'object' ) {
    fullOptions = goog.object.clone(partialOptions);

    for (var key in baseOptions) {
      if ( baseOptions.hasOwnProperty(key) && (! (key in fullOptions) ) ) {
        fullOptions[key] = baseOptions[key];
      }
    }
  } else {
    fullOptions = baseOptions;
  }

  goog.DEBUG && console.info('Returning: ', fullOptions);

  goog.DEBUG && console.groupEnd();
  return fullOptions;
};

/**
 * Obtiene el valor de una configuración de un Objeto de Configuración y lo remueve del objeto.
 * @param {Object} options Objeto de configuración del que se obtendrá el valor
 * @param {string} key Llave de la configuración en el objeto de configuración
 * @return {*} El valor del objeto de configuración si existe o undefined en caso contrario.
 */
openmultimedia.configuration.retrieve = function (options, key) {
  var optionValue;
  if ((typeof options == 'object') && (key in options)) {
    optionValue = options[key];
    delete options[key];
  }
  return optionValue;
};