/**
 * @fileoverview Se definen funciones para ayudar a la localización dinámica en
 * tiempo de ejecución.
 * @author Alan Reyes (kg.designer@gmail.com)
 */
goog.provide('openmultimedia.localization');

goog.require('goog.object');

openmultimedia.localization.extend = function (base, extension) {
  if ( typeof extension != 'object' || goog.object.isEmpty(extension) ) {
    return base;
  };

  var extended = {};

  for (var key in extension) {
    if ( key in base) {
      if ( typeof base[key] == 'object' ) {
        extended[key] = openmultimedia.localization.extend(base[key], extension[key]);
      } else if ( typeof extension[key] != 'object' ) {
        extended[key] = extension[key];
      } else {
        throw Error('No se puede asignar un mapa a un campo escalar');
      }
    } else {
      extended[key] = goog.object.clone(extension[key]);
    }
  }

  return extended;
}
