goog.provide('openmultimedia.componentes.video.JwPlugin');

goog.require('goog.object');
goog.require('openmultimedia');
goog.require('openmultimedia.api');
goog.require('openmultimedia.resources.video');
goog.require('openmultimedia.externals.jwplayer');
goog.require('openmultimedia.componentes.video.JwPluginTemplates');
goog.require('openmultimedia.configuration');

/**
 * Plugin para openmultimedia. Permite reproducir videos directamente mediante el objeto
 * de Clip obtenido del API REST, y reproducir y mostrar el estado de la señal en vivo
 * @param {openmultimedia.Medio} medio Medio asociado a este plugin
 * @param {!jwplayer.Player} player Reproductor jwplayer al que está asociado este plugin
 * @param {openmultimedia.componentes.video.JwPlugin.Configuration} config Configuración pasada a este plugin
 * @param {Element} div DIV HTML asignado a este plugin para overlays.
 * @constructor
 * @implements {jwplayer.PluginInterface}
 * */
openmultimedia.componentes.video.JwPlugin = function(medio, player, config, div) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.video.JwPlugin');

  this.medio_ = medio;

  this.player_ = player;

  this.div_ = div;

  this.mode_ = player.getRenderingMode();

  this.setConfig_(config);

  this.exportConfig_(config);

  // Registramos los callbacks requeridos para la carga de clips del API REST
  player.onReady(goog.bind(this.onPlayerReady_, this));

  player.onPlaylist(goog.bind(this.onPlayerPlaylist_, this));

  goog.DEBUG && console.log(config);

  goog.DEBUG && console.groupEnd();
}

openmultimedia.componentes.video.JwPlugin.prototype.config_ = {
  'lang': 'es',
  'live': true,
  'liveOptions': {
    'position': 'controlbar',
    'startup': false,
    'thumbnail': ''
  }
};

/**
 * Medio asociado a este plugin
 * @type {openmultimedia.Medio}
 */
openmultimedia.componentes.video.JwPlugin.prototype.medio_ = null;

/**
 * Description
 * @type {jwplayer.Player}
 */
openmultimedia.componentes.video.JwPlugin.prototype.player_ = null;

/**
 * Description
 * @type {Element}
 */
openmultimedia.componentes.video.JwPlugin.prototype.div_ = null;

/**
 * Modo de funcionamiento del reproductor, puede ser "flash", "html5" o "download"
 * @type {string}
 */
openmultimedia.componentes.video.JwPlugin.prototype.mode_ = '';

/**
 * Indica cuando el reproductor completó su inicialización.
 * (Se podría acceder a player._ready pero es una propiedad no documentada que
 * podría cambiar sin previo aviso, mejor vamos por la segura)
 * @type {boolean}
 */
openmultimedia.componentes.video.JwPlugin.prototype.playerReady_ = false;

/**
 * Clip que está en espera de ser reproducido
 * @type {?jwplayer.PlaylistItem}
 */
openmultimedia.componentes.video.JwPlugin.prototype.queuedClip_ = null;

/**
 * Si se debe reproducir automáticamente el clip que se mandó a cargar
 * @type {?boolean}
 */
openmultimedia.componentes.video.JwPlugin.prototype.queuedClipAutoplay_ = null;

/**
 * Registro de las cadenas localizadas usadas por la parte JS del plugin
 * @const
 * @type {Object.<string,{en_vivo: string}>}
 * */
openmultimedia.componentes.video.JwPlugin.prototype.localization_ = {
  'es': {
    en_vivo: 'En Vivo'
  },
  'en': {
    en_vivo: 'Live'
  },
  'pt': {
    en_vivo: 'Ao vivo'
  }
};

openmultimedia.componentes.video.JwPlugin.prototype.setConfig_ = function(config) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.video.JwPlugin.prototype.setConfig_');
  var fullConfig = openmultimedia.configuration.complete(config, this.config_);

  // Valida que se haya indicado un lenguaje y que sea válido. Si no lo es,
  // asigna el lenguaje "es" como el default.
  if ('lang' in fullConfig || (!(fullConfig['lang'] in this.localization_))) {
    fullConfig['lang'] = this.config_['lang'];
  }

  //El modo HTML5 no permite la señal en vivo, ya que requiere streaming
  if (this.mode_ === openmultimedia.externals.jwplayer.Mode.HTML5) {
    fullConfig['live'] = false;
  }

  fullConfig['liveOptions'] = openmultimedia.configuration.complete(fullConfig['liveOptions'], this.config_['liveOptions']);

  // Si "position" es cualquier cosa diferente de "dock", es "controlbar" por defecto.
  if (fullConfig['liveOptions']['position'] !== openmultimedia.externals.jwplayer.PluginPosition.Dock) {
    fullConfig['liveOptions']['position'] = openmultimedia.externals.jwplayer.PluginPosition.Controlbar;
  }

  this.config_ = fullConfig;
  goog.DEBUG && console.log(this.config_);
  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.video.JwPlugin.prototype.exportConfig_ = function(target) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.video.JwPlugin.prototype.exportConfig_');

  goog.object.extend(target, this.config_);

  goog.DEBUG && console.log("Extending to: ", target);

  goog.DEBUG && console.groupEnd();
};

/**
 * Si el clip en espera debe reproducirse automáticamente, manda a reproducir el clip cargado
 * Este método esta diseñado para ejecutarse cuando el reproductor ha terminado de cargar un video
 * @param {jwplayer.events.PlaylistEvent} event Evento que dispara esta acción
 * @private
 */
openmultimedia.componentes.video.JwPlugin.prototype.onPlayerPlaylist_ = function(event) {
  goog.DEBUG && console.log('Internal Queue');

  // Si hay un clip en cola, debe ser este que se va a reproducir
  if (this.queuedClip_) {

    // Verifica si el clip pendiente debe reproducirse automáticamente
    if (this.queuedClipAutoplay_) {
      this.player_.play(true);
    }

    // Si había un clip en espera, se elimina de la cola. Debe ser este que se va a reproducir.
    this.queuedClip_ = null; // Se indica que esta propiedad ya no está en uso
    this.queuedClipAutoplay_ = null; // Se indica que esta propiedad ya no está en uso
  }
};

/**
 * Registra la bandera que indica que el reproductor completó su inicialización.
 * Además, si hay un clip en espera de ser reproducido, lo carga.
 * Este método esta diseñado para ejecutarse cuando el reproductor esta listo,
 * @param {jwplayer.events.PlayerEvent} event Evento que dispara esta acción
 * @private
 */
openmultimedia.componentes.video.JwPlugin.prototype.onPlayerReady_ = function(event) {
  goog.DEBUG && console.log('Internal Ready');

  // Verifica si hay un clip pendiente de cargar
  if (this.queuedClip_) {
    this.player_.stop();
    this.player_.load(this.queuedClip_);
  }
  this.playerReady_ = true;
};

/**
 * Ajusta el tamaño/posición de los overlays personalizados cuando el
 * reproductor cambia de tamaño
 * (Actualmente, no hay una lógica necesaria para este método)
 * @param {number} width Ancho nuevo del reproductor
 * @param {number} height Alto nuevo del reproductor
 * @returns {jwplayer.PluginInterface} El plugin
 */
openmultimedia.componentes.video.JwPlugin.prototype.resize = function(width, height) {
  return this;
}

/**
 * Muestra u oculta el overlay con el indicador "En vivo". Es llamado desde
 * el componente en flash del plugin cuando cambia el estado de la señal en vivo.
 * @param {number} status Estado de la reproducción. Debe ser un valor de {@code openmultimedia.componentes.video.JwPlugin.LiveStatus}
 * @return {openmultimedia.componentes.video.JwPlugin} El plugin
 */
openmultimedia.componentes.video.JwPlugin.prototype.setLiveStatus = function(status) {
  if (status === openmultimedia.componentes.video.JwPlugin.LiveStatus.ON) {
    /** @type {string} */
    var lang = this.config_['lang'];

    this.div_.innerHTML = openmultimedia.componentes.video.JwPluginTemplates.LiveOverlay({
      lang: lang,
      localization: this.localization_[lang]
    });

  } else {
    this.div_.innerHTML = '';
  }

  return this;
}

/**
 * Carga un clip de video sacado del API REST (de teleSUR)
 * @param {openmultimedia.api.Clip} clip Objecto Clip obtenido del API REST
 * @param {boolean=} opt_play Cuando debe reproducirse el clip al cargarlo. Por defecto es {@code true}
 * @return {openmultimedia.componentes.video.JwPlugin} El plugin
 */
openmultimedia.componentes.video.JwPlugin.prototype.loadClip = function(clip, opt_play) {
  // Si no se especifica opt_play, se asigna a true
  if (opt_play === undefined) {
    opt_play = true;
  }

  /**
   * Entrada de lista de reproducción en formato JSON para jwPlayer que contendrá
   * la informacion del video a reproducir
   * @type {jwplayer.PlaylistItem}
   */
  var video = {
    'image': "",
    'streamer': "",
    'file': ""
  };

  if ('thumbnail_mediano' in clip) {
    video['image'] = clip['thumbnail_mediano'];
  }

  if ((this.mode_ === openmultimedia.externals.jwplayer.Mode.FLASH) &&
    ('metodo_preferido' in clip) &&
    (clip['metodo_preferido'] === openmultimedia.api.MetodoTransmision.STREAMING) &&
    ('streaming' in clip)) {
    video['streamer'] = clip['streaming']['rtmp_server'];
    video['file'] = clip['streaming']['rtmp_file'];
  } else {
    video['file'] = clip['archivo_url'];
  }

  // Se detiene el video actual y se carga el nuevo

  // Cuando se oculta el elemento HTML que contiene al reproductor, el reproductor
  // se "desactiva" y las llamadas que se hacen a sus métodos no hacen nada
  // hasta que se vuelve a inicializar y a disparar el evento Ready,
  // Por ello, registramos el video en la cola de reproducción aunque el
  // reproductor ya haya sido inicializado previamente, asi cuando dispare el
  // evento Ready, cargará el video de verdad.

  // Se pone el clip en la cola de reproducción.
  // La cola entra en funcionamiento si el reproductor se "desactivó" o esta en activación
  this.queuedClip_ = video;
  // Se registra si el clip en espera de cargarse se reproducirá automáticamente
  this.queuedClipAutoplay_ = opt_play;

  if (this.playerReady_) {
    this.player_.stop();
    this.player_.load(video);
  }

  return this;
}

/**
 * Valores posibles para el estado de la señal en vivo
 * @enum {number}
 */
openmultimedia.componentes.video.JwPlugin.LiveStatus = { /** La señal en vivo está encendida */
  ON: 1,
  /** La señal en vivo está apagada */
  OFF: 2
};

/** @typedef {{lang: string, live: (boolean|undefined), liveOptions: {startup: boolean, position: openmultimedia.externals.jwplayer.PluginPosition, thumbnail: string}}} */
openmultimedia.componentes.video.JwPlugin.Configuration;
