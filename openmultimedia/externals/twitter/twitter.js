goog.provide('openmultimedia.externals.twitter')

goog.require('openmultimedia.externals');

openmultimedia.externals.twitter.widgetIncluded_ = false;

openmultimedia.externals.twitter.requireWidgetLib = function () {
    if ( ! openmultimedia.externals.twitter.widgetIncluded_ && (typeof TWTR == 'undefined' || ! TWTR.Widget) ) {
        var libUrl = 'https://widgets.twimg.com/j/2/widget.js'

        goog.DEBUG && console.info('Inyectando dependencia de Widget Twitter: ', libUrl)
        openmultimedia.externals.inject(libUrl)
        openmultimedia.externals.twitter.widgetIncluded_ = true
    }
}
