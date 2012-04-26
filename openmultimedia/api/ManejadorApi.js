// Namespace
goog.provide('openmultimedia.api.ManejadorApi');

goog.require('openmultimedia.api');
goog.require('goog.net.Jsonp');
goog.require('openmultimedia.utils');
goog.require('openmultimedia.api.ApiRequest');

/**
 * Abstracción para acceder al API Rest Multimedia
 * @constructor
 * @param {openmultimedia.Medio} medio El medio sobre el que trabajará el API
 * @param {string} opt_lang El lenguaje sobre el que trabajará el API. Si no se
 *     indica, se usará el lenguaje por defecto del Medio
 */
openmultimedia.api.ManejadorApi = function(medio, opt_lang) {
  this.medio_ = medio;
  this.lang_ = opt_lang || '';
}

openmultimedia.api.ManejadorApi.prototype.medio_ = null;

openmultimedia.api.ManejadorApi.prototype.lang_ = '';

if ( goog.DEBUG ) {
  openmultimedia.api.ManejadorApi.prototype.timeout_ = 200000;
} else {
  openmultimedia.api.ManejadorApi.prototype.timeout_ = 10000;
}

/**
 * Devuelve el lenguaje actual usado por el Manejador del API
 * @return {string} El lenguaje usado
 */
openmultimedia.api.ManejadorApi.prototype.getLang = function () {
  return this.lang_;
}

/**
 * Cambia el lenguaje en el que está trabajando este Manejador del API REST
 * @param {string} lang El nuevo lenguaje. Si no es un lenguaje válido para el
 *     medio, se usará el lenguaje por defecto del Medio
 */
openmultimedia.api.ManejadorApi.prototype.setLang = function (lang) {
  if ( ! this.medio_.isValidLanguage(lang) ) {
    this.lang_ = this.medio_.getDefaultLanguage();
  } else {
    this.lang_ = lang;
  }
}

/**
 * Método de bajo nivel que ejecuta una petición al API REST
 * @private
 * @param {string} path Ruta relativa al punto de acceso del api a la que se hará la petición
 * @param {Object.<string, string>} queryOptions Parámetros que se pasarán al api mediante la Query String
 * @param {function(Object)} successCallback Función que se llamará con los resultados de la petición
 * @param {function()=}  opt_errorCallback Función que se llamará en caso de que la petición no se complete a tiempo
 */
openmultimedia.api.ManejadorApi.prototype.makeRequest = function(path, queryOptions, successCallback, opt_errorCallback) {
  var apiUrl = this.medio_.getApiUrl(this.lang_) + path;

  goog.DEBUG && console.log("Realizando consulta al API: ", apiUrl, queryOptions);

  // CHECK (arv): ¿Validar que apiUrl termina en "/" o confiamos en el?
  var jsonpRequest = new goog.net.Jsonp(apiUrl);

  jsonpRequest.setRequestTimeout(this.timeout_);

  var errorFunction = opt_errorCallback ? opt_errorCallback : ( goog.DEBUG ? function() { goog.DEBUG && console.error('JSONP Request Timeout'); } : goog.nullFunction );

  var lastRequest = jsonpRequest.send(queryOptions, successCallback, errorFunction);

  return new openmultimedia.api.ApiRequest( jsonpRequest, lastRequest );
}

openmultimedia.api.ManejadorApi.prototype.setConcurrentRequestModel = function (model) {
  this.concurrentRequestModel_ = model;
};

openmultimedia.api.ManejadorApi.prototype.loadClips = function(queryOptions, successCallback, opt_errorCallback) {
  return this.makeRequest('clip/', queryOptions, successCallback, opt_errorCallback);
}

/**
 * Carga la lista completa de programas
 */
openmultimedia.api.ManejadorApi.prototype.loadProgramas = function(queryOptions, successCallback, opt_errorCallback) {
  return this.makeRequest('programa/', queryOptions, successCallback, opt_errorCallback);
}

/**
 * Carga la programación semanal
 */
openmultimedia.api.ManejadorApi.prototype.loadProgramacionSemanal = function(queryOptions, successCallback, opt_errorCallback) {
  return this.makeRequest('programacion/', queryOptions, successCallback, opt_errorCallback);
}

/**
 * Carga la programación actual
 */
openmultimedia.api.ManejadorApi.prototype.loadProgramacionAhora = function(queryOptions, successCallback, opt_errorCallback) {
  return this.makeRequest('programacion/hoy/ahora/', queryOptions, successCallback, opt_errorCallback);
}