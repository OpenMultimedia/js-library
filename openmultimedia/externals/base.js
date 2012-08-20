goog.provide('openmultimedia.externals');

/**
 * Inyecta una etiqueta <script> para inclusión de una biblioteca externa.  Esta
 * función debe llamarse desde el nivel superior del archivo.
 * Función copiada de {@code goog.writeScriptTag_} debido a que dicha función sólo
 * existe en código sin compilar.
 * @param {string} src La url del script a inyectar
 * @return {boolean} Devuelve si fue posible inyectar la dependencia (si se esta
 *     trabajando en un documento HTML)
 */
openmultimedia.externals.injectScriptURL = function(src) {
  if (goog.global.document && goog.global.document.write) {
    var doc = goog.global.document;
    doc.write(
        '<script type="text/javascript" src="' + src + '"></' + 'script>');
    return true;
  } else {
    return false;
  }
};

openmultimedia.externals.injectScriptCode = function(code) {
  if (goog.global.document && goog.global.document.write) {
    var doc = goog.global.document;
    doc.write(
        '<script type="text/javascript">' + code + '</' + 'script>');
    return true;
  } else {
    return false;
  }
};

/** @deprecated Usar injectScriptURL instead*/
openmultimedia.externals.inject = openmultimedia.externals.injectScriptURL;
