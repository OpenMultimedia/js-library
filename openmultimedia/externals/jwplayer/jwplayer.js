/**
 * @fileoverview Biblioteca para trabajar con el componente externo "jwplayer"
 * Contiene las rutas estáticas a la biblioteca JavaScript, al componente SWF y
 * la función global para inyectar la dependencia de la biblioteca JavaScript.
 * @author Alan Reyes (kg.designer@gmail.com)
 */
goog.provide('openmultimedia.externals.jwplayer');

goog.require('openmultimedia.resources.externals.jwplayer');
goog.require('openmultimedia.externals');

openmultimedia.externals.jwplayer.WRAPPER_SUFFIX = '_wrapper';

/**
 * Variable global para identificar cuando la biblioteca JavaScript de jwPlayer
 * ya ha sido cargada.
 * @type {boolean}
 */
openmultimedia.externals.jwplayer.included_ = false;

/**
 * Si no se ha incluido la biblioteca JavaScript de jwplayer, la inyecta desde la
 * ruta definida por {@code openmultimedia.externals.jwplayer.JS_PATH}.
 * @param {string=} opt_path Ruta alternativa a la biblioteca JavaScript.
 */
openmultimedia.externals.jwplayer.requireLib = function (opt_path) {
  var included_ = Boolean(openmultimedia.externals.jwplayer.included_ || (typeof(jwplayer) != 'undefined'));
  if ( ! included_ ) {
    goog.DEBUG && console.info('Inyectando dependencia: Biblioteca JavaScript para JWPlayer: ', openmultimedia.resources.externals.jwplayer.JS_PATH);
    openmultimedia.externals.inject( openmultimedia.resources.externals.jwplayer.JS_PATH );
    openmultimedia.externals.jwplayer.included_ = true;
  }
};

openmultimedia.externals.jwplayer.getWrapperId = function(playerId) {
  return playerId + openmultimedia.externals.jwplayer.WRAPPER_SUFFIX;
};

/**
 * Valores posibles para el modo de funcionamiento del reproductor
 * @enum {string}
 */
openmultimedia.externals.jwplayer.RenderingMode = {
  /** El reproductor está funcionando en modo html5 */
  Html5: 'html5',
  /** El reproductor esta funcionando en modo flash */
  Flash: 'flash',
  /** El reproductor está funcionando en modo download */
  Download: 'download'
}

/**
 * Valores posibles para el modo de funcionamiento del reproductor
 * @enum {string}
 * @deprecated Usar {@code openmultimedia.externals.jwplayer.RenderingMode} en su lugar
 */
openmultimedia.externals.jwplayer.Mode = {
  /** El reproductor está funcionando en modo html5 */
  HTML5: 'html5',
  /** El reproductor esta funcionando en modo flash */
  FLASH: 'flash',
  /** El reproductor está funcionando en modo download */
  DOWNLOAD: 'download'
};

/**
 * Posiciones posibles de un Plugin
 * @enum {string}
 */
openmultimedia.externals.jwplayer.PluginPosition = {
  Dock: 'dock',
  Controlbar: 'controlbar'
};