goog.provide('openmultimedia.api');

/// Se definen los tipos básicos y Estructuras de Datos para el API REST

// Clip del API en forma de Record
/** @typedef {{metodo_preferido: string, archivo_url: string, streaming: { rtmp_server: string, rtmp_file: string }}} */
openmultimedia.api.Clip;

// Definición de un Registro de Programa
/** @typedef {{slug: string, nombre: string, descripcion: string, tipo: {descripcion: string, nombre: string}, imagen_url: string, creatv_id: number}} */
openmultimedia.api.Programa;

/** @typedef {{id: number, nombre: string, hora: {car: string, mad: string, bol: string, cub: string, bue: string, mex: string, bog: string}, hora_final: {car: string}, emision_id: number}} */
openmultimedia.api.HorarioPrograma;

/** @typedef {Object.<string, Array.<openmultimedia.api.HorarioPrograma>>} */
openmultimedia.api.HorarioSemana;

/**
 * Tipos de detalle de Clip
 * TODO (arv): Agregar todos los tipos de detalle
 * @enum {string}
 */
openmultimedia.api.DetalleClip = {
  Completo: 'completo'
};

openmultimedia.api.TipoClip = {
  Entrevista: 'entrevista'
};

openmultimedia.api.MetodoTransmision = {
  HTTP: 'http',
  Streaming: 'streaming'
};