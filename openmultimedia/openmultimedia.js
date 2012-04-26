goog.provide('openmultimedia');

/** @define {string} DEFINE para {@code openmultimedia.BASE_PATH} */
openmultimedia.DEF_BASE_PATH = '';

/**
 * Ruta base a la carpeta con el contenido de OpenMultimedia (o al proyecto)
 * @const
 * @type {string}
 */
openmultimedia.BASE_PATH =
  ((!COMPILED) && goog.global['OPENMULTIMEDIA_BASEPATH']) ||
  openmultimedia.DEF_BASE_PATH ||
  ''; // La ruta por defaultes la raíz del servidor