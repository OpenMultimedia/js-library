goog.provide('openmultimedia.componentes.video.ReproductorNoticias');

goog.require('goog.ui.Component');
goog.require('openmultimedia.componentes.video.JwPlugin');
goog.require('openmultimedia.configuration');
goog.require('openmultimedia.dom.utils');
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

  this.playerId_ = 'openmultimedia_jwplayer_' + goog.getUid(this);

  this.playerWrapperId_ = this.playerId_ + '_outside_wrapper';

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
  this.playerElement_ = goog.dom.createDom('div', { 'id': this.playerId_ });
  this.element_ = goog.dom.createDom('div', { 'id': this.playerWrapperId_, 'style': 'width: 100%; height: 100%;' }, this.playerElement_);
};

/** @override */
openmultimedia.componentes.video.ReproductorNoticias.prototype.enterDocument = function() {
  var jwOptions = this.getJwOptions_();

  goog.DEBUG && console.log('Installing jwplayer in: ', this.playerElement_, 'with: ', jwOptions);

  this.player_ = jwplayer(this.playerElement_).setup(jwOptions);

  this.player_.onReady(goog.partial(openmultimedia.componentes.video.ReproductorNoticias.onJwplayerReady_, this));
  this.player_.onPlaylist(goog.partial(openmultimedia.componentes.video.ReproductorNoticias.onJwplayerPlaylist_, this));

  goog.base(this, 'enterDocument');
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.getJwOptions_ = function() {
  var jwOptions = goog.object.clone(this.jwplayerOptions_);

  if (this.element_) {
    var divSize = goog.style.getSize(this.element_);

    jwOptions['width'] = divSize.width;
    jwOptions['height'] = divSize.height;
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

openmultimedia.componentes.video.ReproductorNoticias.prototype.setCurrentVideo_ = function(video) {
  this.currentVideo_ = video;
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.getCurrentVideo_ = function() {
  return this.currentVideo_;
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.setCurrentAutoplay_ = function(autoplay) {
  this.currentAutoplay_ = autoplay;
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.getCurrentAutoplay_ = function() {
  return this.currentAutoplay_;
};

openmultimedia.componentes.video.ReproductorNoticias.prototype.playClip = function(clipData, autoplay) {
  var video = {
    'image': clipData['thumbnail_mediano']
  };

  if (clipData['metodo_preferido'] == openmultimedia.api.MetodoTransmision.Streaming) {
    video.streamer = clipData['streaming']['rtmp_server'];
    video.file = clipData['streaming']['rtmp_file'];
  } else {
    video.file = clipData['archivo_url'];
  }

  if (this.player_) {
    // Se detiene el video actual y se carga el nuevo
    this.player_.stop();
    this.player_.load(video);
  }

  //Se pone el clip en la cola de reproducción.
  //La cola entra en funcionamiento si el reproductor se "desactivó" o esta en activación
  this.setCurrentVideo_(video);
  this.setCurrentAutoplay_(autoplay);
};

/** @this {jwplayer.Player} */
openmultimedia.componentes.video.ReproductorNoticias.onJwplayerReady_ = function(multimediaPlayer, event) {
  goog.DEBUG && console.log('External Ready');

  var queuedVideo = multimediaPlayer.getCurrentVideo_();

  if (queuedVideo) {
    goog.DEBUG && console.log('External Queue Process');
    this.stop();
    this.load(queuedVideo);
    multimediaPlayer.setCurrentVideo_(null);
  }
};

/** @this {jwplayer.Player} */
openmultimedia.componentes.video.ReproductorNoticias.onJwplayerPlaylist_ = function(multimediaPlayer, event) {
  var autoplay = multimediaPlayer.getCurrentAutoplay_();

  if (autoplay) {
    this.play(true);
    multimediaPlayer.setCurrentAutoplay_(false);
  }
};
