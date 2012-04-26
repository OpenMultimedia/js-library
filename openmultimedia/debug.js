goog.provide('openmultimedia.debug');

openmultimedia.debug.LOG_LEVEL = goog.DEBUG ? goog.debug.Logger.Level.WARNING : goog.debug.Logger.Level.OFF;

openmultimedia.debug.logger = goog.debug.Logger.getLogger('openmultimedia');

openmultimedia.debug.logger.setLevel(openmultimedia.debug.LOG_LEVEL);