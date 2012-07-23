goog.provide('openmultimedia.componentes.video.ReproductorNoticias');

goog.require('goog.ui.Component');
goog.require('openmultimedia.componentes.video.JwPlugin');
goog.require('openmultimedia.configuration');
goog.require('openmultimedia.externals.jwplayer');
goog.require('openmultimedia.resources.externals.jwplayer');
goog.require('openmultimedia.resources.video.jwplugin');
goog.require('goog.object');

openmultimedia.externals.jwplayer.requireLib();

/**
 * Wrapper para comunicarse con un reproductor jwPlayer asociado a un elemento
 * de jQuery
 * @param {openmultimedia.Medio} medio El medio asociado a este reproductor.
 * @param {Object=} options Opciones de configuración de este reproductor.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM Helper asociado al reproductor.
 * @constructor
 * @extends {goog.ui.Component}
 */
openmultimedia.componentes.video.ReproductorNoticias = function(medio, options, opt_domHelper) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.video.ReproductorNoticias', arguments);

  this.medio_ = medio;

  this.playerWrapperId_ = 'openmultimedia_jwplayer_outside_wrapper_' + goog.getUid(this);

  this.setOptions(options);

  goog.base(this, opt_domHelper);

  goog.DEBUG && console.groupEnd();
};

goog.inherits(openmultimedia.componentes.video.ReproductorNoticias, goog.ui.Component);

openmultimedia.componentes.video.ReproductorNoticias.prototype.setOptions = function(options) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.video.ReproductorNoticias.prototype.setOptions');

  goog.DEBUG && console.log('Setting options: ', options);

  var newOptions = goog.object.clone(options);

  var newJwplayerOptions = openmultimedia.configuration.retrieve(newOptions, 'jwplayerOptions');

  var newMultimediaPluginOptions = openmultimedia.configuration.retrieve(newOptions, 'multimediaPluginOptions');

  this.setMainOptions(newOptions);

  this.setJwplayerOptions(newJwplayerOptions);

  this.setMultimediaPluginOptions(newMultimediaPluginOptions);

  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.setMainOptions = function(options) {
  var fullOptions = openmultimedia.configuration.complete(options, this.options_);

  this.options_ = fullOptions;
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.setJwplayerOptions = function(options) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.video.ReproductorNoticias.prototype.setJwplayerOptions', arguments);

  this.jwplayerOptions_ = openmultimedia.configuration.complete(options, this.jwplayerOptions_);

  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.setMultimediaPluginOptions = function(options) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.video.ReproductorNoticias.prototype.setMultimediaPluginOptions', arguments);

  var fullOptions = openmultimedia.configuration.complete(options, this.multimediaPluginOptions_);

  var newConfig = openmultimedia.configuration.complete(fullOptions['config'], this.multimediaPluginOptions_['config']);

  fullOptions['config'] = newConfig;

  this.multimediaPluginOptions_ = fullOptions;

  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.medio_ = null;

openmultimedia.componentes.video.ReproductorNoticias.prototype.containerNode_ = null;

openmultimedia.componentes.video.ReproductorNoticias.prototype.playerReady_ = false;

openmultimedia.componentes.video.ReproductorNoticias.prototype.pendingClipList_ = null;

openmultimedia.componentes.video.ReproductorNoticias.prototype.pendingVideoList_ = null;

openmultimedia.componentes.video.ReproductorNoticias.prototype.pendingAutoplay_ = null;

openmultimedia.componentes.video.ReproductorNoticias.prototype.options_ = {
  'multimediaPlugin': true,
  'ads' : true
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.multimediaPluginOptions_ = {
  'name': openmultimedia.resources.video.jwplugin.MULTIMEDIA_PLUGIN_NAME,
  'path': openmultimedia.resources.video.jwplugin.MULTIMEDIA_PLUGIN_PATH,
  'config': {
    'live': true,
    'liveOptions': {
      'enabled': true,
      'startup': false,
      'position': openmultimedia.externals.jwplayer.PluginPosition.Controlbar
    }
  }
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.jwplayerOptions_ = {
  'skin': openmultimedia.resources.externals.jwplayer.skin.GLOW_SKIN,
  'dock': false,
  'debug': 'none',
  'controlbar.position': 'bottom',
  'autostart': false,
  'modes': [
    {'type': 'flash', 'src': openmultimedia.resources.externals.jwplayer.SWF_PATH},
    {'type': 'html5'},
    {'type': 'download'}
  ],
  'plugins': {}
};


/**
 * Solicita la carga de un clip de video obtenido del API REST
 * @param {openmultimedia.api.Clip} clip Clip de video obtenido del API REST.
 * @param {boolean} autoplay Cuando el video debe reproducirse automáticamente.
 *
openmultimedia.componentes.video.ReproductorNoticias.prototype.playClip = function (clip, autoplay) {
  goog.DEBUG && console.log("Do Play Clip");
  if ( this.playerReady ) {
    goog.DEBUG && console.log("External load");
    (/** @type {telesur.player.jwplayer.MultimediaPluginInterface} * player.getPlugin("telesur")).loadClip(clip, autoplay);
  } else {
    goog.DEBUG && console.log("External deferred load");
    this.currentVideo = clip
    this.currentAutoplay = autoplay;
  }
};*/

/** @override */
openmultimedia.componentes.video.ReproductorNoticias.prototype.createDom = function() {
    goog.DEBUG && console.log("DOM CREATE");

    this.element_ = goog.dom.createDom('div', { 'id': this.playerWrapperId_, 'style': 'width: 100%; height: 100%;' });

    this.playerId_ = 'openmultimedia_jwplayer_' + goog.getUid({});

    this.playerElement_ = goog.dom.createDom('div', { 'id': this.playerId_ });

    goog.dom.append(this.element_, this.playerElement_);
};

/** @override */
openmultimedia.componentes.video.ReproductorNoticias.prototype.enterDocument = function() {
    goog.DEBUG && console.log("ENTER DOCUMENT");
    var jwOptions = this.getJwOptions_();

    goog.DEBUG && console.log('Installing jwplayer in: ', this.playerId_, 'with: ', jwOptions);

    this.player_ = jwplayer(this.playerId_).setup(jwOptions);

    var playerContainer = this.player_.getContainer();

    this.playerElement_ = playerContainer.parentNode;

    this.player_.onReady(goog.partial(openmultimedia.componentes.video.ReproductorNoticias.onJwplayerReady_, this));

    this.player_.onPlaylist(goog.partial(openmultimedia.componentes.video.ReproductorNoticias.onJwplayerPlaylist_, this));

    goog.base(this, 'enterDocument');
};

/** @override */
openmultimedia.componentes.video.ReproductorNoticias.prototype.exitDocument = function() {
  goog.DEBUG && console.log('EXIT Removing player');

  if ( this.playerReady_ ) {
    this.player_.stop();
    //this.player_.remove();
  } else {
    //goog.style.showElement( this.playerElement_, false );
    //this.player_.onReady(function(){ this.remove(); });
  }

  this.player_ = null;
  this.playerReady_ = false;
  this.playerElement_ = null;

  goog.base(this, 'exitDocument');
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.getJwOptions_ = function() {
  var jwOptions = goog.object.clone(this.jwplayerOptions_);

  if (this.element_) {
    var divSize = goog.style.getSize(this.element_);

    if ( ! ('width' in jwOptions) ) {
      jwOptions['width'] = divSize.width;
    }

    if ( ! ('height' in jwOptions) ) {
      jwOptions['height'] = divSize.height;
    }
  }

  var internalPlugins = {};

  if (this.options_['multimediaPlugin']) {
    internalPlugins[this.multimediaPluginOptions_['path']] = this.multimediaPluginOptions_['config'];
  }

  if ( ! goog.object.isEmpty(internalPlugins) ) {
    jwOptions['plugins'] = openmultimedia.configuration.complete(internalPlugins, jwOptions['plugins']);
  }

  return jwOptions;
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.setPendingClipList_ = function(clipData) {
  this.pendingClipList_ = clipData;
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.getPendingClipList_ = function() {
  return this.pendingClipList_;
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.setPendingVideoList_ = function(videoList) {
  this.pendingVideoList_ = videoList;
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.getPendingVideoList_ = function() {
  return this.pendingVideoList_;
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.setPendingAutoplay_ = function(autoplay) {
  this.pendingAutoplay_ = autoplay;
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.getPendingAutoplay_ = function() {
  return this.pendingAutoplay_;
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.clearPending_ = function() {
  this.pendingAutoplay_ = false;
  this.pendingVideoList_ = null;
  this.pendingClipList_ = null;
}

/** @deprecated Utilizar {@code playClipList} en su lugar*/
openmultimedia.componentes.video.ReproductorNoticias.prototype.playClip = function(clipData, autoplay) {
  this.playClipList([clipData], autoplay);
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.playClipList = function(clipData, autoplay) {
  goog.DEBUG && console.log('Playing', clipData);
  this.clearPending_();

  if (this.player_ && this.playerReady_) {
    var renderingMode = this.player_.getRenderingMode();

    if ( renderingMode ) {
      // Se detiene el video actual y se carga el nuevo
      try {
        this.player_.stop();
      } catch (e) {
        goog.DEBUG && console.warn('No se pudo detener el video: ' + e);
      }

      var videoList = openmultimedia.componentes.video.ReproductorNoticias.makePlaylist( clipData, renderingMode );

      goog.DEBUG && console.log('Playing VideoList', videoList);

      try {
        this.player_.load(videoList);
      } catch(e) {
        goog.DEBUG && console.warn('No se pudo cargar los videos: ' + e);
      }

      // Se conoce el Modo de Rendering actual, se guarda la lista de reproducción procesada en caso de que el player este en modo de espera
      this.setPendingVideoList_(videoList);
    }
  }

  // El reproductor no ha sido inicializado. Se guarda la lista de clips completa.
  this.setPendingClipList_(clipData);

  this.setPendingAutoplay_(autoplay);
};

openmultimedia.componentes.video.ReproductorNoticias.stop = function() {
  if ( this.player_ ) {
    this.player_.stop();
  }
}

/** @this {jwplayer.Player} */
openmultimedia.componentes.video.ReproductorNoticias.onJwplayerReady_ = function(multimediaPlayer, event) {
  goog.DEBUG && console.log('External Ready', event);

  multimediaPlayer.playerReady_ = true;

  var pendingVideoList = multimediaPlayer.getPendingVideoList_();

  if ( ! pendingVideoList ) {
    var pendingClipList = multimediaPlayer.getPendingClipList_();

    if ( pendingClipList ) {
      pendingVideoList = openmultimedia.componentes.video.ReproductorNoticias.makePlaylist(pendingClipList, this.getRenderingMode());
    }
  }

  if (pendingVideoList) {
    goog.DEBUG && console.log('External Queue Process', pendingVideoList);
    this.stop();
    this.load(pendingVideoList);
    multimediaPlayer.setPendingVideoList_(null);
    multimediaPlayer.setPendingClipList_(null);
  }
};

/** @this {jwplayer.Player} */
openmultimedia.componentes.video.ReproductorNoticias.onJwplayerPlaylist_ = function(multimediaPlayer, event) {
  var autoplay = multimediaPlayer.getPendingAutoplay_();

  if (autoplay) {
    this.play(true);
    multimediaPlayer.setPendingAutoplay_(false);
  }
};

openmultimedia.componentes.video.ReproductorNoticias.makePlaylist = function (clipList, renderingMode) {
  goog.DEBUG && console.log('Convirtiendo a Playlist', clipList);

  if ( goog.typeOf(clipList) == 'object' ) {
    clipList = [ clipList ];
  }

  var streamingSupport = false;
  streamingSupport = (renderingMode == openmultimedia.externals.jwplayer.RenderingMode.Flash);

  var videoList =[];

  var currentClip;

  var video;

  for ( var i = 0; i < clipList.length; i += 1 ) {
    currentClip = clipList[i];

    video = {
        'title': currentClip['titulo'],
        'description': currentClip['descripcion'],
        'duration': currentClip['duracion'],
        'image': currentClip['thumbnail_mediano'],
        'playlist.image': currentClip['thumbnail_pequeno']
    };

    if ( streamingSupport && ( currentClip['metodo_preferido'] == openmultimedia.api.MetodoTransmision.STREAMING ) ) {
      video['streamer'] = currentClip['streaming']['rtmp_server'];
      video['file'] = currentClip['streaming']['rtmp_file'];
    } else {
      video['file'] = currentClip['archivo_url'];
      video['provider']  = 'http';
      video['http.startparam'] = 'start';
    }

    videoList[i] = video;
  }

  goog.DEBUG && console.log('Playlist', videoList);

  return videoList;
};
