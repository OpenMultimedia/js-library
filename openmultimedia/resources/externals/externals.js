goog.provide('openmultimedia.resources.externals');

goog.require('openmultimedia.resources');

/** @define {string} Define para {@code openmultimedia.resources.externals.DIR_NAME} */
openmultimedia.resources.externals.DEF_DIR_NAME = '';

/** @define {string} Define para {@code openmultimedia.resources.externals.DIR_PATH} */
openmultimedia.resources.externals.DEF_DIR_PATH = '';

/**
 * Nombre base del directorio donde se encuentran los recursos de bibliotecas externas
 * @const
 * @type {string}
 */
openmultimedia.resources.externals.DIR_NAME =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_EXTERNALS_DIRNAME']) ||
  openmultimedia.resources.externals.DEF_DIR_NAME ||
  'externals';

/**
 * Ruta del directorio donde se encuentran los recursos de bibliotecas externas
 * @const
 * @type {string}
 */
openmultimedia.resources.externals.DIR_PATH =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_RESOURCES_EXTERNALS_DIRPATH']) ||
  openmultimedia.resources.externals.DEF_DIR_PATH ||
  (openmultimedia.resources.DIR_PATH + '/' + openmultimedia.resources.externals.DIR_NAME);