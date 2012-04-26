// This file was automatically generated from ButtonListFilter.soy.
// Please don't edit this file by hand.

goog.provide('openmultimedia.componentes.mapas.ButtonListFilterTemplates');

goog.require('soy');
goog.require('soy.StringBuilder');
goog.require('goog.i18n.bidi');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
openmultimedia.componentes.mapas.ButtonListFilterTemplates.container = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="openmultimedia-componentes-mapa-button-list-filter">');
  var itemList6 = opt_data.items;
  var itemListLen6 = itemList6.length;
  for (var itemIndex6 = 0; itemIndex6 < itemListLen6; itemIndex6++) {
    var itemData6 = itemList6[itemIndex6];
    output.append('<div id="', soy.$$escapeHtml(opt_data.idPrefix), '-', soy.$$escapeHtml(itemData6.slug), '" class="openmultimedia-componentes-mapa-buttonlistfilter-item ', soy.$$escapeHtml(opt_data.classes.button), ' ', (! (itemIndex6 == itemListLen6 - 1)) ? soy.$$escapeHtml(opt_data.classes.buttonCollapseRight) : '', ' ', (! (itemIndex6 == 0)) ? soy.$$escapeHtml(opt_data.classes.buttonCollapseLeft) : '', '">', soy.$$escapeHtml(opt_data.localization[itemData6.slug].nombre), '</div>');
  }
  output.append('</div>');
  return opt_sb ? '' : output.toString();
};
