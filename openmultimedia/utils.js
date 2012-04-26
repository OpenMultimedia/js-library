goog.provide('openmultimedia.utils');

goog.require('goog.object');

/** @deprecated */
openmultimedia.utils.completeOptions = function (defaultOptions, partialOptions) {
  var fullOptions = goog.object.clone(defaultOptions);
  if ( typeof partialOptions == 'object' ) {
    goog.object.extend(fullOptions, partialOptions);
  }
  return fullOptions;
};

/** @deprecated */
openmultimedia.utils.retrieveSubOptions = function (mainOptions, subOptionsKey) {
  var subOptions = false;
  if ( subOptionsKey in mainOptions ) {
    subOptions = mainOptions[subOptionsKey];
    delete mainOptions[subOptionsKey];
  }
  return subOptions;
}