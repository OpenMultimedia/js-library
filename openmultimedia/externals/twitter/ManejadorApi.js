goog.provide('openmultimedia.externals.twitter.ManejadorApi');

goog.require('goog.net.Jsonp');

/**
 * Punto de acceso al API de Twitter
 * @const
 * @type {string}
 */
openmultimedia.externals.twitter.API_URL = 'https://api.twitter.com';

/** @define {string} Define para {@code openmultimedia.externals.twitter.API_KEY} */
openmultimedia.externals.twitter.DEF_API_KEY = '';

/**
 * API Key a usar para Twitter
 * @const
 * @type {string}
 */
openmultimedia.externals.twitter.API_KEY =
    ((!COMPILED) && goog.global['OPENMULTIMEDIA_EXTERNALS_TWITTER_APIKEY']) ||
    openmultimedia.externals.twitter.DEF_API_KEY ||
    '';

/**
 * Manejador del API de Twitter.
 * @param {{'cache': boolean}=} opt_options Objeto de configuración del Manejador
 * @constructor
 */
openmultimedia.externals.twitter.ManejadorApi = function (opt_options) {
  this.setOptions(opt_options);

  if (this.options_['cache']) {
    this.cache_ = {};
    this.pending_ = {};
  }
};

openmultimedia.externals.twitter.ManejadorApi.prototype.options_ = {
  'cache': true
};

openmultimedia.externals.twitter.ManejadorApi.prototype.cache_ = null;

openmultimedia.externals.twitter.ManejadorApi.prototype.pending_ = null;

openmultimedia.externals.twitter.ManejadorApi.prototype.setOptions = function (options) {
  var fullOptions = openmultimedia.configuration.complete(options, this.options_);

  this.options_ = fullOptions;
};

openmultimedia.externals.twitter.ManejadorApi.prototype.registerCache_ = function (cacheType, cacheKey, data) {
  if ( ! (cacheType in this.cache_) ) {
    this.cache_[cacheType] = {};
  }

  this.cache_[cacheType][cacheKey] = {
    data: data,
    time: goog.now()
  };
};

openmultimedia.externals.twitter.ManejadorApi.prototype.getCached_ = function (cacheType, cacheKey) {
  if ( ( cacheType in this.cache_ ) && ( cacheKey in this.cache_[cacheType] ) ) {
    return this.cache_[cacheType][cacheKey].data;
  }

  return null;
};

openmultimedia.externals.twitter.ManejadorApi.prototype.isPending_ = function (cacheType, cacheKey) {
  return Boolean( ( cacheType in this.pending_ ) && ( cacheKey in this.pending_[cacheType] ) && ( this.pending_[cacheType][cacheKey].running ) );
};

openmultimedia.externals.twitter.ManejadorApi.prototype.registerPendingCallbacks_ = function (cacheType, cacheKey, successCallback, errorCallback) {
  if ( successCallback ) {
    this.registerCallback_(this.pending_[cacheType][cacheKey].success, successCallback);
  }

  if ( errorCallback ) {
    this.registerCallback_(this.pending_[cacheType][cacheKey].error, errorCallback);
  }
};

openmultimedia.externals.twitter.ManejadorApi.prototype.getSuccessCallbacks_ = function (cacheType, cacheKey) {
  return this.pending_[cacheType][cacheKey].success;
};

openmultimedia.externals.twitter.ManejadorApi.prototype.getErrorCallbacks_ = function (cacheType, cacheKey) {
  return this.pending_[cacheType][cacheKey].error;
};

openmultimedia.externals.twitter.ManejadorApi.prototype.registerCallback_ = function (callbackArray, callback) {
  var collectionSize = callbackArray.length;

  for (var i = 0; i < collectionSize; i += 1) {
    if (callbackArray[i] == callback) {
      return;
    }
  }

  callbackArray[collectionSize] = callback;
};

/**
 * Ejecuta los callbacks en la lista como resultado de una petición al API de Twitter
 * @param {Array.<function(Array.<Object>)>} callbackList Arreglo de funciones a ejecutar
 * @param {Array.<Array.<Object>>=} opt_arguments Argumentos a pasar a las funciones ejecutadas
 */
openmultimedia.externals.twitter.ManejadorApi.prototype.fireCallbacks_ = function (callbackList, opt_arguments) {
  var callbackArguments = opt_arguments || [];
  for ( var i = 0; i < callbackList.length; i += 1 ) {
    callbackList[i].apply(goog.global, callbackArguments);
  }
}

openmultimedia.externals.twitter.ManejadorApi.prototype.clearPending_ = function (cacheType, cacheKey) {
  goog.DEBUG && console.log('Eliminando pendientes');
  delete this.pending_[cacheType][cacheKey];
}

openmultimedia.externals.twitter.ManejadorApi.prototype.onSuccess_ = function (cacheType, cacheKey, tweetList) {
  goog.DEBUG && console.log('Disparando callbacks exitosos');
  this.registerCache_(cacheType, cacheKey, tweetList);

  this.fireCallbacks_( this.getSuccessCallbacks_(cacheType, cacheKey), [tweetList]);
  this.clearPending_(cacheType, cacheKey);
};

openmultimedia.externals.twitter.ManejadorApi.prototype.onError_ = function (cacheType, cacheKey) {
  goog.DEBUG && console.log('Disparando callbacks erroneos');
  this.fireCallbacks_( this.getErrorCallbacks_(cacheType, cacheKey) );
  this.clearPending_(cacheType, cacheKey);
};

openmultimedia.externals.twitter.ManejadorApi.prototype.executeRequest = function (path, queryParams, successCallback, errorCallback) {
  var jsonp = new goog.net.Jsonp( openmultimedia.externals.twitter.API_URL + path );

  jsonp.send( queryParams, successCallback, errorCallback );
};

openmultimedia.externals.twitter.ManejadorApi.prototype.get = function (cacheType, cacheKey, apiPath, queryParams, successCallback, errorCallback) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.externals.twitter.ManejadorApi.prototype.get');
  goog.DEBUG && console.log(arguments);

  if ( this.options_['cache']) {
    goog.DEBUG && console.log('Verificando cache...');
    var cached = this.getCached_(cacheType, cacheKey);

    goog.DEBUG && console.log('Cache: ', cached);

    if ( cached ) {
      goog.DEBUG && console.log('Devolviendo de cache...');
      successCallback.apply(goog.global, [ cached ]);
      return;
    }

    if ( this.isPending_(cacheType, cacheKey) ) {
      goog.DEBUG && console.log('Registrando pendiente...');
      this.registerPendingCallbacks_(cacheType, cacheKey, successCallback, errorCallback);
      return;
    }
  }

  if ( ! ( cacheType in this.pending_ ) ) {
    this.pending_[cacheType]  = {};
  }

  if ( ! ( cacheKey in this.pending_[ cacheType ] ) ) {
    this.pending_[cacheType][cacheKey] = {
      running: true,
      success: [],
      error: []
    }
  };

  this.registerPendingCallbacks_(cacheType, cacheKey, successCallback, errorCallback);

  var globalSuccesCallback = goog.bind(this.onSuccess_, this, cacheType, cacheKey);

  var globalErrorCallback = goog.bind(this.onError_, this, cacheType, cacheKey);

  goog.DEBUG && console.log('Ejecutando peticion...');
  this.executeRequest(apiPath, queryParams, globalSuccesCallback, globalErrorCallback);

  goog.DEBUG && console.groupEnd();
};

openmultimedia.externals.twitter.ManejadorApi.prototype.getLastTweet = function (screenName, successCallback, errorCallback) {
  var apiPath = '/statuses/user_timeline.json';
  var queryParams = {'screen_name': screenName, 'count': 1, 'include_rts': 1};

  this.get(openmultimedia.externals.twitter.ManejadorApi.CacheType.LAST_TWEET, screenName, apiPath, queryParams, successCallback, errorCallback);
};

openmultimedia.externals.twitter.ManejadorApi.CacheType = {
  LAST_TWEET: 1
};