// This file was automatically generated from SkinnableInfoWindow.soy.
// Please don't edit this file by hand.

goog.provide('openmultimedia.componentes.mapas.SkinnableInfoWindowTemplates');

goog.require('soy');
goog.require('soy.StringBuilder');
goog.require('goog.i18n.bidi');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
openmultimedia.componentes.mapas.SkinnableInfoWindowTemplates.container = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="openmultimedia-infowindow-container"><div class="openmultimedia-infowindow-overlay"></div><div class="openmultimedia-infowindow-window"><div class="openmultimedia-infowindow-window-content-wrapper"><div class="openmultimedia-infowindow-window-content"></div><div class="openmultimedia-infowindow-window-close-button"></div></div></div></div>');
  return opt_sb ? '' : output.toString();
};
