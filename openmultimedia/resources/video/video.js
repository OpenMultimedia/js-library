goog.provide('openmultimedia.resources.video');

goog.require('openmultimedia.resources');

/** @define {string} Define para {@code openmultimedia.resources.video.DIR_NAME} */
openmultimedia.resources.video.DEF_DIR_NAME = '';

/** @define {string} Define para {@code openmultimedia.resources.video.DIR_PATH} */
openmultimedia.resources.video.DEF_DIR_PATH = '';

/** @define {string} Define para {@code openmultimedia.resources.video.LIVE_THUMBNAIL_FILENAME} */
openmultimedia.resources.video.DEF_LIVE_THUMBNAIL_FILENAME = '';

/** @define {string} Define para {@code openmultimedia.resources.video.LIVE_THUMBNAIL_PATH} */
openmultimedia.resources.video.DEF_LIVE_THUMBNAIL_PATH = '';

/**
 * Nombre base del directorio que guarda los recursos de Video
 * @const
 * @type {string}
 */
openmultimedia.resources.video.DIR_NAME =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_VIDEO_DIRNAME']) ||
  openmultimedia.resources.video.DEF_DIR_NAME ||
  'video';

/**
 * Ruta del directorio que guarda los recursos de Video
 * @const
 * @type {string}
 */
openmultimedia.resources.video.DIR_PATH =
    ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_VIDEO_DIRPATH']) ||
    openmultimedia.resources.video.DEF_DIR_PATH ||
    openmultimedia.resources.DIR_PATH + '/' + openmultimedia.resources.video.DIR_NAME;

/**
 * Nombre base del archivo usado como Miniatura de la señal en Vivo
 * @const
 * @type {string}
 */
openmultimedia.resources.video.LIVE_THUMBNAIL_FILENAME =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_VIDEO_LIVETHUMBNAILFILENAME']) ||
  openmultimedia.resources.video.DEF_LIVE_THUMBNAIL_FILENAME ||
  'live-thumbnail.png';

/**
 * Ruta del archivo usado como Miniatura de la señal en Vivo
 * @const
 * @type {string}
 */
openmultimedia.resources.video.LIVE_THUMBNAIL_PATH =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_VIDEO_LIVETHUMBNAILPATH']) ||
  openmultimedia.resources.video.DEF_LIVE_THUMBNAIL_PATH ||
  (openmultimedia.resources.video.DIR_PATH + '/' + openmultimedia.resources.video.LIVE_THUMBNAIL_FILENAME);