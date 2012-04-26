// This file was automatically generated from JwPlugin.soy.
// Please don't edit this file by hand.

goog.provide('openmultimedia.componentes.video.JwPluginTemplates');

goog.require('soy');
goog.require('soy.StringBuilder');
goog.require('goog.i18n.bidi');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
openmultimedia.componentes.video.JwPluginTemplates.LiveOverlay = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div lang="', soy.$$escapeHtml(opt_data.lang), '" class="openmultimedia-componentes-player-overlay-live-on">', soy.$$escapeHtml(opt_data.localization.en_vivo), '</div>');
  return opt_sb ? '' : output.toString();
};
