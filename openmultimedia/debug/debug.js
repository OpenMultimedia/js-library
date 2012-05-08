goog.provide('openmultimedia.debug');


/** @constructor */
openmultimedia.debug.Console = function() {};

openmultimedia.debug.Console.prototype.log = ( goog.DEBUG && console && console.log ) || goog.nullFunction;

openmultimedia.debug.Console.prototype.info = ( goog.DEBUG && console && console.info ) || goog.emptyFunction;

openmultimedia.debug.Console.prototype.group = ( goog.DEBUG && console && ( console.group || console.info ) ) || goog.emptyFunction;

openmultimedia.debug.Console.prototype.groupCollapsed = openmultimedia.debug.Console.prototype.group;

openmultimedia.debug.Console.prototype.groupEnd = ( goog.DEBUG && console && ( console.groupEnd || console.info ) ) || goog.emptyFunction;

openmultimedia.debug.nativeConsole_ = goog.global.console;

goog.global.console = new openmultimedia.debug.Console();