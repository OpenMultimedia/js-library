goog.provide('openmultimedia.resources');

goog.require('openmultimedia');

/** @define {string} DEFINE para {@code openmultimedia.resources.DIR_NAME} */
openmultimedia.resources.DEF_DIR_NAME = '';

/** @define {string} DEFINE para {@code openmultimedia.resources.DIR_PATH} */
openmultimedia.resources.DEF_DIR_PATH = '';

/**
 * Nombre del directorio base para los recursos de OpenMultimedia
 * @const
 * @type {string}
 */
openmultimedia.resources.DIR_NAME =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_DIRNAME']) ||
  openmultimedia.resources.DEF_DIR_NAME ||
  'resources';

/**
 * Ruta del directorio base para los recursos de OpenMultimedia
 * @const
 * @type {string}
 */
openmultimedia.resources.DIR_PATH =
    ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_DIRPATH']) ||
    openmultimedia.resources.DEF_DIR_PATH ||
    (openmultimedia.BASE_PATH + '/' + openmultimedia.resources.DIR_NAME);