goog.provide('openmultimedia.resources.video.jwplugin');

goog.require('openmultimedia.resources.video');

/** @define {string} Define para {@code openmultimedia.resources.video.jwplugin.DEF_DEBUG} */
openmultimedia.resources.video.jwplugin.DEF_DEBUG = '';

/** @define {string} Define para {@code openmultimedia.resources.video.jwplugin.DIR_NAME} */
openmultimedia.resources.video.jwplugin.DEF_DIR_NAME = '';

/** @define {string} Define para {@code openmultimedia.resources.video.jwplugin.DIR_PATH} */
openmultimedia.resources.video.jwplugin.DEF_DIR_PATH = '';

/** @define {string} Define para {@code openmultimedia.resources.video.jwplugin.MULTIMEDIA_PLUGIN_NAME} */
openmultimedia.resources.video.jwplugin.DEF_MULTIMEDIA_PLUGIN_NAME = '';

/** @define {string} Define para {@code openmultimedia.resources.video.jwplugin.MULTIMEDIA_PLUGIN_FILENAME} */
openmultimedia.resources.video.jwplugin.DEF_MULTIMEDIA_PLUGIN_FILENAME = '';

/** @define {string} Define para {@code openmultimedia.resources.video.jwplugin.MULTIMEDIA_PLUGIN_PATH} */
openmultimedia.resources.video.jwplugin.DEF_MULTIMEDIA_PLUGIN_PATH = '';

/**
 * Indica si se usarán las versiones DEBUG o RELEASE del plugin
 * @const
 * @type {boolean}
 */
openmultimedia.resources.video.jwplugin.DEBUG =
    ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_VIDEO_JWPLUGIN_DEBUG']) ||
    openmultimedia.resources.video.jwplugin.DEF_DEBUG ||
    goog.DEBUG;

/**
 * Nombre base del directorio con los recursos para el Plugin de jwPlayer
 * @const
 * @type {string}
 */
openmultimedia.resources.video.jwplugin.DIR_NAME =
    ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_VIDEO_JWPLUGIN_DIRNAME']) ||
    openmultimedia.resources.video.jwplugin.DEF_DIR_NAME ||
    'jwplugin';

/**
 * Ruta del directorio con los recursos para el Plugin de jwPlayer
 * @const
 * @type {string}
 */
openmultimedia.resources.video.jwplugin.DIR_PATH =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_VIDEO_JWPLUGIN_DIRPATH']) ||
  openmultimedia.resources.video.jwplugin.DEF_DIR_PATH ||
  (openmultimedia.resources.video.DIR_PATH + '/' + openmultimedia.resources.video.jwplugin.DIR_NAME);

/**
 * Nombre base del Plugin de jwPlayer
 * @const
 * @type {string}
 */
openmultimedia.resources.video.jwplugin.MULTIMEDIA_PLUGIN_NAME =
    ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_VIDEO_JWPLUGIN_MULTIMEDIAPLUGINNAME']) ||
    openmultimedia.resources.video.jwplugin.DEF_MULTIMEDIA_PLUGIN_NAME ||
    (openmultimedia.resources.video.jwplugin.DEBUG ? 'openmultimedia' : 'openmultimedia.min');

/**
 * Nombre de archivo base del Plugin de jwPlayer
 * @const
 * @type {string}
 */
openmultimedia.resources.video.jwplugin.MULTIMEDIA_PLUGIN_FILENAME =
    ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_VIDEO_JWPLUGIN_MULTIMEDIAPLUGINFILENAME']) ||
    openmultimedia.resources.video.jwplugin.DEF_MULTIMEDIA_PLUGIN_FILENAME ||
    (openmultimedia.resources.video.jwplugin.MULTIMEDIA_PLUGIN_NAME + '.js');

/**
 * Ruta del archivo del Plugin de jwPlayer
 * @const
 * @type {string}
 */
openmultimedia.resources.video.jwplugin.MULTIMEDIA_PLUGIN_PATH =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_VIDEO_JWPLUGIN_MULTIMEDIAPLUGINPATH']) &&
  openmultimedia.resources.video.jwplugin.DEF_MULTIMEDIA_PLUGIN_PATH ||
  (openmultimedia.resources.video.jwplugin.DIR_PATH + '/' + openmultimedia.resources.video.jwplugin.MULTIMEDIA_PLUGIN_FILENAME);
