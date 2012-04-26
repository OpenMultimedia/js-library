goog.provide('openmultimedia.resources.externals.jwplayer');
goog.provide('openmultimedia.resources.externals.jwplayer.skin');

goog.require('openmultimedia.resources.externals');

/** @define {string} Define para {@code openmultimedia.resources.externals.jwplayer.DIR_NAME} */
openmultimedia.resources.externals.jwplayer.DEF_DIR_NAME = '';

/** @define {string} Define para {@code openmultimedia.resources.externals.jwplayer.DIR_PATH} */
openmultimedia.resources.externals.jwplayer.DEF_DIR_PATH = '';

/** @define {string} Define para {@code openmultimedia.resources.externals.jwplayer.SWF_FILENAME} */
openmultimedia.resources.externals.jwplayer.DEF_SWF_FILENAME = '';

/** @define {string} Define para {@code openmultimedia.resources.externals.jwplayer.SWF_PATH} */
openmultimedia.resources.externals.jwplayer.DEF_SWF_PATH = '';

/** @define {string} Define para {@code openmultimedia.resources.externals.jwplayer.JS_FILENAME} */
openmultimedia.resources.externals.jwplayer.DEF_JS_FILENAME = '';

/** @define {string} Define para {@code openmultimedia.resources.externals.jwplayer.JS_PATH} */
openmultimedia.resources.externals.jwplayer.DEF_JS_PATH = '';

/**
 * Nombre base del directorio con los recursos de jwPlayer
 * @const
 * @type {string}
 */
openmultimedia.resources.externals.jwplayer.DIR_NAME =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_EXTERNALS_JWPLAYER_DIRNAME']) ||
  openmultimedia.resources.externals.jwplayer.DEF_DIR_NAME ||
  'jwplayer';

/**
 * Ruta del directorio con los recursos de jwPlayer
 * @const
 * @type {string}
 */
openmultimedia.resources.externals.jwplayer.DIR_PATH =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_EXTERNALS_JWPLAYER_DIRPATH']) ||
  openmultimedia.resources.externals.jwplayer.DEF_DIR_PATH ||
  (openmultimedia.resources.externals.DIR_PATH + '/' + openmultimedia.resources.externals.jwplayer.DIR_NAME);

/**
 * Nombre base del archivo SWF del reproductor jwPlayer
 * @const
 * @type {string}
 */
openmultimedia.resources.externals.jwplayer.SWF_FILENAME =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_EXTERNALS_JWPLAYER_SWFFILENAME']) ||
  openmultimedia.resources.externals.jwplayer.DEF_SWF_FILENAME ||
  'player.swf';

/**
 * Ruta del archivo SWF del reproductor jwPlayer
 * @const
 * @type {string}
 */
openmultimedia.resources.externals.jwplayer.SWF_PATH =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_EXTERNALS_JWPLAYER_SWFPATH']) ||
  openmultimedia.resources.externals.jwplayer.DEF_SWF_PATH ||
  (openmultimedia.resources.externals.jwplayer.DIR_PATH + '/' + openmultimedia.resources.externals.jwplayer.SWF_FILENAME);

/**
 * Nombre base de la biblioteca JS del reproductor jwplayer
 * @const
 * @type {string}
 */
openmultimedia.resources.externals.jwplayer.JS_FILENAME =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_EXTERNALS_JWPLAYER_JSFILENAME']) ||
  openmultimedia.resources.externals.jwplayer.DEF_JS_FILENAME ||
  (goog.DEBUG ? 'jwplayer-debug.js' : 'jwplayer.js');

/**
 * Ruta de la biblioteca JS del reproductor jwplayer
 * @const
 * @type {string}
 */
openmultimedia.resources.externals.jwplayer.JS_PATH =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_EXTERNALS_JWPLAYER_JSPATH']) ||
  openmultimedia.resources.externals.jwplayer.DEF_JS_PATH ||
  (openmultimedia.resources.externals.jwplayer.DIR_PATH + '/' + openmultimedia.resources.externals.jwplayer.JS_FILENAME);

/** @define {string} Define para {@code openmultimedia.resources.externals.jwplayer.skin.DIR_NAME} */
openmultimedia.resources.externals.jwplayer.skin.DEF_DIR_NAME = '';

/** @define {string} Define para {@code openmultimedia.resources.externals.jwplayer.skin.DIR_PATH} */
openmultimedia.resources.externals.jwplayer.skin.DEF_DIR_PATH = '';

/** @define {string} Define para {@code openmultimedia.resources.externals.jwplayer.skin.GLOW_SKIN} */
openmultimedia.resources.externals.jwplayer.skin.DEF_GLOW_SKIN = '';

/** @define {string} Define para {@code openmultimedia.resources.externals.jwplayer.skin.DEFAULT_SKIN} */
openmultimedia.resources.externals.jwplayer.skin.DEF_DEFAULT_SKIN = '';

/**
 * Nombre base del directorio donde se almacenan las skins de jwPlayer
 * @const
 * @type {string}
 */
openmultimedia.resources.externals.jwplayer.skin.DIR_NAME =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_EXTERNALS_JWPLAYER_SKIN_DIRNAME']) ||
  openmultimedia.resources.externals.jwplayer.skin.DEF_DIR_NAME ||
  'skin';

/**
 * Ruta del directorio donde se almacenan las skins de jwPlayer
 * @const
 * @type {string}
 */
openmultimedia.resources.externals.jwplayer.skin.DIR_PATH =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_EXTERNALS_JWPLAYER_SKIN_DIRPATH']) ||
  openmultimedia.resources.externals.jwplayer.skin.DEF_DIR_PATH ||
  (openmultimedia.resources.externals.jwplayer.DIR_PATH + '/' + openmultimedia.resources.externals.jwplayer.skin.DIR_NAME);

/**
 * Ruta del Skin Glow para jwplayer
 * http://www.longtailvideo.com/addons/skins/196/Glow
 * @const
 * @type {string}
 */
openmultimedia.resources.externals.jwplayer.skin.GLOW_SKIN =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_EXTERNALS_JWPLAYER_SKIN_GLOW']) ||
  openmultimedia.resources.externals.jwplayer.skin.DEF_GLOW_SKIN ||
  (openmultimedia.resources.externals.jwplayer.skin.DIR_PATH + '/glow.zip' );

/**
 * Ruta del Skin por defecto para jwplayer
 * @const
 * @type {string}
 */
openmultimedia.resources.externals.jwplayer.skin.DEFAULT_SKIN =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_EXTERNALS_JWPLAYER_SKIN_DEFAULT']) ||
  openmultimedia.resources.externals.jwplayer.skin.DEF_DEFAULT_SKIN ||
  openmultimedia.resources.externals.jwplayer.skin.GLOW_SKIN;