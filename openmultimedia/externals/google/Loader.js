goog.provide("openmultimedia.externals.google.Loader")

goog.provide("openmultimedia.externals.google.Loader.feeds")

openmultimedia.externals.google.Loader.included_ = false

openmultimedia.externals.google.Loader.requireLib = function () {
    // Se valida que la biblioteca no haya sido incluida
    if ( ! openmultimedia.externals.google.Loader.included_ && (typeof google == 'undefined' || ! google.load) ) {
        var libUrl = 'https://www.google.com/jsapi'

        goog.DEBUG && console.info('Inyectando dependencia de Biblioteca JavaScript de Google: ', libUrl)

        openmultimedia.externals.inject(libUrl)

        openmultimedia.externals.google.Loader.included_ = true
    }
}

openmultimedia.externals.google.Loader.feeds.included_ = false

openmultimedia.externals.google.Loader.feeds.requireLib = function (version, pack) {

    openmultimedia.externals.google.Loader.requireLib()

    // Se valida que la biblioteca no haya sido incluida
    if ( ! openmultimedia.externals.google.Loader.feeds.included_ && (typeof google == 'undefined' || ! google.feeds) ) {
        openmultimedia.externals.injectScriptCode("google.load('feeds', '" + version + "', '" + pack + "')")
        openmultimedia.externals.google.Loader.feeds.included_ = true
    }
}
