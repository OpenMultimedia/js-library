goog.provide('openmultimedia.Medio');

goog.require('openmultimedia.DescriptorMedio');
goog.require('goog.array');

/**
 * Manejador para el medio actual
 * @param {openmultimedia.Medio.DescriptorMedio} descriptorMedio Descriptor que
 *     define las configuraciones generales del medio
 * @param {string} language Lenguaje que usará el Medio
 * @constructor
 */
openmultimedia.Medio = function(descriptorMedio, language) {
    this.descriptorMedio_ = descriptorMedio;

    if ( ! this.descriptorMedio_.lenguajes ) {
      throw Error('No se han indicado lenguajes válidos para este Medio')
    }

    var validLanguages = {};
    var defaultLanguage;
    var lenguajes = this.descriptorMedio_.lenguajes;

    for ( var i = 0; i < lenguajes.length; i += 1 ) {
        if ( i == 0 ) {
            defaultLanguage = lenguajes[i];
        }

        validLanguages[lenguajes[i].slug] = lenguajes[i];
    }

    this.validLanguages_ = validLanguages;

    this.defaultLanguage_ = defaultLanguage.slug;

    this.language_ = ( language && language in validLanguages ) ? language : defaultLanguage.slug;
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
openmultimedia.Medio.prototype.validLanguages_ = {};

openmultimedia.Medio.prototype.getLanguage = function () {
    var lang = this.validLanguages_[ this.language_ ];

    return { slug: lang.slug, nombre: openmultimedia.Medio.getLocalizedString(lang.nombre) }
}

openmultimedia.Medio.prototype.getLanguageCode = function () {
    return this.language_;
}

/**
 * Valida que el lenguaje dado sea válido. Si lo es, devuelve el lenguaje dado;
 * si no, devuelve el lenguaje por defecto (que por definición es válido para el medio).
 * @param {string=} opt_lang El lenguaje a validar. Si se omite, se devuelve el lenguaje por defecto.
 * @return {string} Un lenguaje válido para este Medio
 * @deprecated Use isValidLanguage, getDefaultLanguage instead
 */
openmultimedia.Medio.prototype.getValidLanguage = function (opt_lang) {
  if ( opt_lang && opt_lang in this.validLanguages_ ) {
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
  return Boolean( lang && lang in this.validLanguages_ );
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
 * @return {Object.<string>} Un arreglo con los lenguajes válidos para el medio
 */
openmultimedia.Medio.prototype.getValidLanguages = function () {
  return this.descriptorMedio_.lenguajes;
}

/**
 * Devuelve la URL del API en el lenguaje indicado. Si no se indica un lenguaje, se usará el default.
 * @param {string} opt_lang Código del lenguaje a utilizar en el API REST.
 *     Si el lenguaje no es válido para este medio, se usará el lenguaje por defecto.
 * @return {string} Url base API REST para este medio en el lenguaje seleccionado
 * @deprecated
 */
openmultimedia.Medio.prototype.getApiUrl = function () {
    var api = this.getApi('multimedia');
    return api.url;
}

openmultimedia.Medio.prototype.getApi = function (apiName) {
    if ( ! this.descriptorMedio_.apis ) {
        return null;
    }

    var apis = this.descriptorMedio_.apis;

    if ( ! apiName in apis ) {
        return null;
    }

    var api = this.descriptorMedio_.apis[apiName];

    return {
        titulo: openmultimedia.Medio.getLocalizedString(api.titulo, this.language_, this.defaultLanguage_)
        ,url: openmultimedia.Medio.getLocalizedString(api.url, this.language_, this.defaultLanguage_)
    }
}

openmultimedia.Medio.prototype.getFeedUrl = function (siteName, feedFormat) {
    if ( ! this.descriptorMedio_.links ) return null

    var links = this.descriptorMedio_.links

    if ( ! siteName in links ) return null

    var site = this.descriptorMedio_.links[siteName]

    if ( ! site ) return null

    if ( ! site.feeds ) return null

    if (! (feedFormat in site.feeds) ) return null

    var feed = site.feeds[feedFormat]

    return openmultimedia.Medio.getLocalizedString(feed, this.language_, this.defaultLanguage_)
}

openmultimedia.Medio.getLocalizedString = function (localizedString, preferredLang, defaultLang) {
    if ( typeof localizedString === 'string' ) {
        return localizedString;
    } else {
        if ( preferredLang in localizedString ) {
            return localizedString[preferredLang]
        } else {
            return localizedString[defaultLang]
        }
    }
}
