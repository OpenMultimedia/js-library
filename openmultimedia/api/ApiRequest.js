goog.provide('openmultimedia.api.ApiRequest');

goog.require('goog.net.Jsonp');

/**
 * Representación de una petición en proceso al API. Puede utilizarse para
 * cancelar dicha petición.
 * @param {!goog.net.Jsonp} jsonp Controlador de la petición JSONP
 * @param {Object|null} request Identificador de la petición devuelto por {@code goog.net.Jsonp.send}
 * @constructor
 */
openmultimedia.api.ApiRequest = function (jsonp, request) {
  this.jsonp_ = jsonp;
  this.request_ = request;
}

/**
 * Controlador de la petición JSONP
 * @type {goog.net.Jsonp}
 */
openmultimedia.api.ApiRequest.prototype.jsonp_ = null;

/**
 * Identificador de la petición
 * @type {Object}
 */
openmultimedia.api.ApiRequest.prototype.request_ = null;

/**
 * Cancela la petición en progreso.
 */
openmultimedia.api.ApiRequest.prototype.cancel = function () {
  this.jsonp_.cancel(this.request_);
  return;
};