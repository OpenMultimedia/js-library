goog.provide('openmultimedia.debug');


/** @constructor */

if ( ! (console && console.group) ) {
  console.group = function() { console.info(arguments); }
}

if ( ! (console && console.groupColapsed) ) {
  console.groupCollapsed = function() { console.info(arguments); }
}

if ( ! (console && console.groupEnd) ) {
  console.groupEnd = function() { console.info(arguments); }
}
