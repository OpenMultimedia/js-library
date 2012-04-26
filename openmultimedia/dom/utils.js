goog.provide('openmultimedia.dom.utils');

goog.require('goog.dom');

openmultimedia.dom.utils.helperContainer_ = null;

openmultimedia.dom.utils.getHelperContainer = function () {
  if ( ! openmultimedia.dom.utils.helperContainer_ ) {
    var helperContainer = goog.dom.createDom('div', {'style': 'position: absolute; left: -9999999'});
    var body = goog.dom.getElementsByTagNameAndClass('body')[0];
    goog.dom.appendChild(body, helperContainer);
    openmultimedia.dom.utils.helperContainer_ = helperContainer;
  }

  return openmultimedia.dom.utils.helperContainer_;
};