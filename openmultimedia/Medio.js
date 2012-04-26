goog.provide('openmultimedia.Medio');

goog.require('goog.array');

/**
 * Manejador para el medio actual
 * @param {openmultimedia.Medio.DescriptorMedio} descriptorMedio Descriptor que
 *     define las configuraciones generales del medio
 * @param {string} defaultLanguage Lenguaje que usará el Medio por defecto
 *     en caso de que no se indique un lenguaje.
 * @constructor
 */
openmultimedia.Medio = function(descriptorMedio, defaultLanguage) {
  this.descriptorMedio_ = descriptorMedio;

  if ( ! defaultLanguage in this.descriptorMedio_ ) {
    throw Error('El lenguaje por defecto no es válido para el Descriptor de Medio');
  }

  var validLanguages = [];
  for ( var lang in this.descriptorMedio_ ) {
    validLanguages.push(lang);
  };

  this.validLanguages_ = validLanguages;
  this.defaultLanguage_ = defaultLanguage;
}

/**
 * Objeto universal del Medio según se define en
 * @type {?openmultimedia.Medio.DescriptorMedio}
 */
openmultimedia.Medio.prototype.descriptorMedio_ = null;

/**
 * Define el lenguaje por defecto que utiliza este medio
 * @type {string}
 */
openmultimedia.Medio.prototype.defaultLanguage_ = '';

/**
 * Arreglo con los lenguajes válidos para el medio
 * @type {Array.<string>}
 */
openmultimedia.Medio.prototype.validLanguages_ = [];

/**
 * Valida que el lenguaje dado sea válido. Si lo es, devuelve el lenguaje dado;
 * si no, devuelve el lenguaje por defecto (que por definición es válido para el medio).
 * @param {string=} opt_lang El lenguaje a validar. Si se omite, se devuelve el lenguaje por defecto.
 * @return {string} Un lenguaje válido para este Medio
 * @deprecated Use isValidLanguage, getDefaultLanguage instead
 */
openmultimedia.Medio.prototype.getValidLanguage = function (opt_lang) {
  if ( opt_lang && opt_lang in this.descriptorMedio_ ) {
    return opt_lang;
  }

  return this.defaultLanguage_;
};

/**
 * Devuelve si el lenguaje indicado es válido para este medio
 * @param {string} lang El lenguaje a validar.
 * @return {boolean} Si el lenguaje es válido para este medio
 */
openmultimedia.Medio.prototype.isValidLanguage = function (lang) {
  return Boolean( lang && lang in this.descriptorMedio_ );
}

/**
 * Devuelve el lenguaje por defecto para el medio
 * @return {string} El lenguaje por defecto para el medio
 */
openmultimedia.Medio.prototype.getDefaultLanguage = function () {
  return this.defaultLanguage_;
}

/**
 * Devuelve un arreglo con los lenguajes válidos para el medio. Para validar si
 * un lenguaje es válido, usar {@code isValidLanguage}
 * @return {Array.<string>} Un arreglo con los lenguajes válidos para el medio
 */
openmultimedia.Medio.prototype.getValidLanguages = function () {
  return this.validLanguages_;
}

/**
 * Devuelve la URL del API en el lenguaje indicado. Si no se indica un lenguaje, se usará el default.
 * @param {string} opt_lang Código del lenguaje a utilizar en el API REST.
 *     Si el lenguaje no es válido para este medio, se usará el lenguaje por defecto.
 * @return {string} Url base API REST para este medio en el lenguaje seleccionado
 */
openmultimedia.Medio.prototype.getApiUrl = function (opt_lang) {

  /**
   * El lenguaje que se usará en el API. Se usa getValidLanguage para obtener un
   * lenguaje válido para el medio
   * @type {string}
   */
  var lang;

  if ( opt_lang && this.isValidLanguage(opt_lang) ) {
    lang = opt_lang;
  } else {
    lang = this.getDefaultLanguage();
  }

  //CHECK (arv): ¿Habria que validar si 'api_url' termina en "/" o confiamos en que si se inyectará bien?
  return this.descriptorMedio_[lang].api_url;
}

/**
 * Descriptor del Medio según se define en:
 * https://gist.github.com/23f079c364b015fa0187
 * @typedef {Object.<string, {nombre: string, slug: string, api_url: string, media_url: string, streaming: Array.<{nombre: string, slug: string, tipo: string, host: string, streams: {adaptive: { stream: string }, 360p: {stream: string }, 160p: {stream:string}}, protocols: { rtmp:{ port: number, manifest: string }, hls: {port: number, playlist: string}, rtsp: {port: number}}}>}>}
 */
openmultimedia.Medio.DescriptorMedio;