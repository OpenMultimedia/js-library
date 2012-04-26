// This file was automatically generated from ClipInfoWindow.soy.
// Please don't edit this file by hand.

goog.provide('openmultimedia.componentes.mapas.ClipInfoWindowTemplates');

goog.require('soy');
goog.require('soy.StringBuilder');
goog.require('goog.i18n.bidi');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
openmultimedia.componentes.mapas.ClipInfoWindowTemplates.container = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="openmultimedia-infowindow"><div class="openmultimedia-infowindow-info"><div class="openmultimedia-infowindow-info-item"><div class="openmultimedia-infowindow-info-item-clip"><img class="openmultimedia-infowindow-info-item-thumbnail" /><h3 class="openmultimedia-infowindow-info-item-title"></h3><div class="openmultimedia-infowindow-info-item-timeplace"></div></div><div class="openmultimedia-infowindow-info-item-player"></div><div class="openmultimedia-infowindow-info-item-corresponsal"><span class="openmultimedia-infowindow-info-item-corresponsal-label">', soy.$$escapeHtml(opt_data.localization.etiquetas.corresponsal), '</span><span class="openmultimedia-infowindow-info-item-corresponsal-nombre"></span><div class="openmultimedia-infowindow-info-item-corresponsal-twitter"><span class="openmultimedia-infowindow-info-item-corresponsal-twitter-screenname"></span><span class="openmultimedia-infowindow-info-item-corresponsal-twitter-tweet"></span></div></div><div class="openmultimedia-infowindow-info-item-entrevista"><div class="openmultimedia-infowindow-info-item-entrevistado"><span class="openmultimedia-infowindow-info-item-entrevistado-label">', soy.$$escapeHtml(opt_data.localization.etiquetas.entrevistado), '</span><span class="openmultimedia-infowindow-info-item-entrevistado-nombre"></span></div><div class="openmultimedia-infowindow-info-item-entrevistador"><span class="openmultimedia-infowindow-info-item-entrevistador-label">', soy.$$escapeHtml(opt_data.localization.etiquetas.entrevistador), '</span><span class="openmultimedia-infowindow-info-item-entrevistador-nombre"></span></div></div></div><div class="openmultimedia-infowindow-nav"><div class="openmultimedia-infowindow-nav-prev"></div><div class="openmultimedia-infowindow-nav-next"></div><div class="openmultimedia-infowindow-nav-pagination"><span class="openmultimedia-infowindow-nav-pagination-current"></span> / <span class="openmultimedia-infowindow-nav-pagination-total"></span></div></div></div>');
  return opt_sb ? '' : output.toString();
};
