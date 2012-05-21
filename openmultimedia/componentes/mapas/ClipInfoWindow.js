goog.provide('openmultimedia.componentes.mapas.ClipInfoWindow');

goog.require('goog.dom');
goog.require('goog.style');

goog.require('openmultimedia.api');
goog.require('openmultimedia.api.utils');
goog.require('openmultimedia.componentes.mapas');
goog.require('openmultimedia.componentes.mapas.ClipInfoWindowTemplates');
goog.require('openmultimedia.componentes.mapas.SkinnableInfoWindow');
goog.require('openmultimedia.componentes.video.ReproductorNoticias');
goog.require('openmultimedia.externals.twitter.ManejadorApi');

/**
 * @constructor
 */
openmultimedia.componentes.mapas.ClipInfoWindow = function (medio, opt_options) {
  goog.DEBUG && console.log('Creating info window');

  this.medio_ = medio;

  this.setOptions(opt_options);

  var WindowTypeEnum = openmultimedia.componentes.mapas.InfoWindowType;

  switch ( this.options_['type'] ) {
    case WindowTypeEnum.InfoWindow:
      this.infoWindow_ = new google.maps.InfoWindow();

      break;
    case WindowTypeEnum.Overlay:
    default:
      this.infoWindow_ = new openmultimedia.componentes.mapas.SkinnableInfoWindow();
      break;
  }

  if ( this.options_['twitter'] ) {
    this.twitterApi_ = new openmultimedia.externals.twitter.ManejadorApi();
  }

  var lang = this.options_['lang'];

  this.nodo_ = soy.renderAsFragment(openmultimedia.componentes.mapas.ClipInfoWindowTemplates.container, { localization: this.localization_[lang] });

  this.divClipInfo = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-info-item-clip'), this.nodo_);
  this.imgThumbnail = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-info-item-thumbnail'), this.nodo_);

  this.hTitle = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-info-item-title'), this.nodo_);
  this.divTimeplace = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-info-item-timeplace'), this.nodo_);
  this.divPlayer = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-info-item-player'), this.nodo_);
  this.divCorresponsalInfo = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-info-item-corresponsal'), this.nodo_);
  this.spanCorresponsalNombre = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-info-item-corresponsal-nombre'), this.nodo_);

  this.divCorresponsalTwitter = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-info-item-corresponsal-twitter'), this.nodo_);
  this.divCorresponsalTwitterAvatar = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-info-item-corresponsal-twitter-avatar'), this.divCorresponsalTwitter);
  this.spanCorresponsalTwitterScreenname =
  goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-info-item-corresponsal-twitter-screenname'), this.divCorresponsalTwitter);

  this.spanCorresponsalTwitterTweet =
  goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-info-item-corresponsal-twitter-tweet'), this.divCorresponsalTwitter);

  this.divEntrevistaInfo = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-info-item-entrevista'), this.nodo_);

  this.divEntrevistadoInfo = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-info-item-entrevistado'), this.nodo_);
  this.spanEntrevistadoNombre = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-info-item-entrevistado-nombre'), this.nodo_);

  this.divEntrevistadorInfo = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-info-item-entrevistador'), this.nodo_);
  this.spanEntrevistadorNombre = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-info-item-entrevistador-nombre'), this.nodo_);

  this.divPagination = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-nav'), this.nodo_);
  this.divPaginationPrev = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-nav-prev'), this.nodo_);
  this.divPaginationNext = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-nav-next'), this.nodo_);
  this.spanPaginationCurrent = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-nav-pagination-current'), this.nodo_);
  this.spanPaginationTotal = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-nav-pagination-total'), this.nodo_);

  goog.events.listen( this.divPaginationNext, 'click', this.onClickNext_, false, this );

  goog.events.listen( this.divPaginationPrev, 'click', this.onClickPrev_, false, this );

  if ( ! this.options_['player'] ) {
    goog.style.showElement(this.imgThumbnail, true);
    goog.style.showElement(this.divPlayer, false);
  } else {
    goog.style.showElement(this.imgThumbnail, false);
    goog.style.showElement(this.divPlayer, true);
    this.player_ = new openmultimedia.componentes.video.ReproductorNoticias(this.medio_, this.playerOptions_);

    /*
    if ( this.options_['type'] == WindowTypeEnum.InfoWindow ) {
      google.maps.addEventListener( this.infoWindow_, 'closeclick', goog.bind(this.onInfoWindowClosed_, this) );
    } else {
      goog.events.listen(this.infoWindow_, 'closeclick', goog.bind(this.onInfoWindowClosed_, this) );
    }
    */
  }
}

openmultimedia.componentes.mapas.ClipInfoWindow.medio_ = null;

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.localization_ = {
  'es': {
     etiquetas: {
        corresponsal: 'Corresponsal: ',
        entrevistado : 'Entrevistado: ',
        entrevistador : 'Entrevistador: '
      }
  },
  'en': {
     etiquetas: {
         corresponsal: 'Correspondent: ',
         entrevistado : 'Interviewee: ',
         entrevistador : 'Interviewer: '
      }
  },
  'pt': {
     etiquetas: {
         corresponsal: 'Correspondente: ',
         entrevistado : 'Entrevistado: ',
         entrevistador : 'Entrevistador: '
      }
  }
};

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.options_ = {
  'lang': '',
  'type': openmultimedia.componentes.mapas.InfoWindowType.Overlay,
  'twitter': true,
  'player': true
};

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.playerOptions_ = {
  'multimediaPlugin': true,
  'multimediaPluginOptions': {
    'config': {
      'live':true,
      'liveOptions': {
        'position': 'dock' //TODO (arv): Configurar desde una Enumeración,
      }
    }
  }
};

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.infoWindow_ = null;
openmultimedia.componentes.mapas.ClipInfoWindow.prototype.currentMarker_ = null;
openmultimedia.componentes.mapas.ClipInfoWindow.prototype.dataList_ = null;
openmultimedia.componentes.mapas.ClipInfoWindow.prototype.currentIndex_ = 0;

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.player_ = null;

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.setOptions = function (options) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.ClipInfoWindow.setOptions');

  goog.DEBUG && console.log('Setting options:', options);

  var newPlayerOptions = openmultimedia.configuration.retrieve(options, 'playerOptions');

  var newLocalization = openmultimedia.configuration.retrieve(options, 'localization');

  this.setMainOptions( options );

  if ( newPlayerOptions ) {
    this.setPlayerOptions( newPlayerOptions );
  }

  if ( newLocalization ) {
    this.setLocalization( newLocalization );
  }

  goog.DEBUG && console.groupEnd();
}

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.setMainOptions = function (options) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.ClipInfoWindow.setMainOptions');

  goog.DEBUG && console.log(this.options_, options);

  var fullOptions = openmultimedia.configuration.complete(options, this.options_);

  this.options_ = fullOptions;

  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.setPlayerOptions = function (options) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.ClipInfoWindow.setPlayerOptions');

  var fullOptions = openmultimedia.configuration.complete(options, this.playerOptions_);
  fullOptions['multimediaPluginOptions']['config'] = openmultimedia.configuration.complete(fullOptions['multimediaPluginOptions']['config'], this.playerOptions_['multimediaPluginOptions']['config']);

  if ( (! fullOptions['lang']) || (fullOptions['lang'] != this.options_['lang']) ) {
    fullOptions['lang'] != this.options_['lang']
  }

  this.playerOptions_ = fullOptions;

  goog.DEBUG && console.log( 'New Player Options', this.playerOptions_ );

  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.setLocalization = function ( localization ) {
  var fullLocalization = openmultimedia.localization.extend(this.localization_, localization);
  this.localization = fullLocalization;
};

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.open = function ( marker ) {
  if ( this.currentMarker_ == marker ) {
    return;
  }

  this.currentMarker_ = marker;

  this.infoWindow_.setContent( this.nodo_ );

  this.infoWindow_.open( marker.map, marker );

  if ( this.options_['player'] ) {
    if ( ! this.player_.isInDocument() ) {
      this.player_.render(this.divPlayer);
    }
  }
}

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.close = function () {
  this.currentMarker_ = null;
  this.infoWindow_.close();
}

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.setDataList = function (dataList) {
  this.dataList_ = dataList;

  if (this.dataList_.length == 1) {
    goog.style.showElement(this.divPagination, false);
  } else {
    goog.dom.setTextContent(this.spanPaginationTotal, this.dataList_.length);
    goog.style.showElement(this.divPagination, true);
  }

  this.reset();
}

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.reset = function() {
  if ( this.dataList_ && this.dataList_.length > 0 ) {
    this.setCurrentIndex(0);
  } else {
    this.close();
  }
}

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.setCurrentIndex = function(index) {
  this.currentIndex_ = index;
  this.fillData_(this.dataList_[index]);
  goog.dom.setTextContent(this.spanPaginationCurrent, index + 1);
  this.infoWindow_.setContent( this.nodo_ );
};

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.fillData_ = function(dataItem) {
  goog.DEBUG && console.log('Filling with:', dataItem);

  var lang = this.options_['lang'];

  goog.dom.setTextContent( this.hTitle, dataItem['titulo']);
  goog.dom.setTextContent( this.divTimeplace, openmultimedia.api.utils.formatDatePlace(dataItem, lang) );
  goog.dom.setProperties( this.imgThumbnail, { 'src': dataItem['thumbnail_pequeno'] } );

  if ( dataItem['corresponsal'] ) {
    goog.style.showElement( this.divCorresponsalInfo, true );
    goog.style.showElement( this.divCorresponsalTwitter, false );

    goog.dom.setTextContent( this.spanCorresponsalNombre, dataItem['corresponsal']['nombre'] );

    if (this.options_['twitter'] && dataItem['corresponsal']['twitter']) {
      goog.DEBUG && console.log('Loading last Tweet');
      this.twitterUser_ = dataItem['corresponsal']['twitter'].toLowerCase();
      this.twitterApi_.getLastTweet(this.twitterUser_, goog.bind(this.onCargarUltimoTweet_, this) );
    } else {
      this.twitterUser_ = null;
    }
  } else {
    goog.style.showElement( this.divCorresponsalInfo, false );
  }

  if ( openmultimedia.api.utils.clipEsDeTipo( dataItem, openmultimedia.api.TipoClip.Entrevista ) ) {
    goog.style.showElement(this.divEntrevistaInfo, true);

    if ( dataItem['entrevistado'] ) {
      goog.style.showElement(this.divEntrevistadoInfo, true);
      goog.dom.setTextContent(this.spanEntrevistadoNombre, dataItem['entrevistado']['nombre']);
    } else {
      goog.style.showElement(this.divEntrevistadoInfo, false);
    }

    if ( dataItem['entrevistador'] ) {
      goog.style.showElement(this.divEntrevistadorInfo, true);
      goog.dom.setTextContent(this.spanEntrevistadorNombre, dataItem['entrevistador']['nombre']);
    } else {
      goog.style.showElement(this.divEntrevistadorInfo, false);
    }

  } else {
    goog.style.showElement(this.divEntrevistaInfo, false);
  }

  if ( this.options_['player'] ) {
    this.player_.playClip( dataItem );
  }
}

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.onCargarUltimoTweet_ = function (tweetList) {
  goog.DEBUG && console.log('Laast tweet loaded:', arguments);

  if ( tweetList.length <= 0 ) {
    return;
  }

  var tweet = tweetList[0];

  if ( tweet["user"]["screen_name"].toLowerCase() != this.twitterUser_ ) {
    return;
  }

  this.divCorresponsalTwitterAvatar.style.backgroundImage = 'url(' + tweet['user']['profile_image_url'] + ')';
  goog.dom.setTextContent(this.spanCorresponsalTwitterScreenname, '@' + this.twitterUser_ );
  goog.dom.setTextContent(this.spanCorresponsalTwitterTweet, tweetList[0].text );

  goog.style.showElement( this.divCorresponsalTwitter, true);

  if (this.currentMarker_) {
    // Si hay un Marker elegido, la ventana esta abierta, se reasigna el nodo para paliar el problema de reasignacion de tamaño
    this.infoWindow_.setContent( this.nodo_ );
  }
};

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.getCurrentMarker = function () {
  return this.currentMarker_;
};

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.onClickNext_ = function () {
  var newIndex = this.currentIndex_ + 1;
  if ( newIndex >= this.dataList_.length ) {
    newIndex = 0;
  }

  this.setCurrentIndex( newIndex );
};

openmultimedia.componentes.mapas.ClipInfoWindow.prototype.onClickPrev_ = function () {
  var newIndex = this.currentIndex_ - 1;
  if ( newIndex < 0 ) {
    newIndex = this.dataList_.length - 1;
  }

  this.setCurrentIndex( newIndex );
};

/*
openmultimedia.componentes.mapas.ClipInfoWindow.prototype.onInfoWindowClosed_ = function () {
  goog.DEBUG  && console.log('IW Closed');
  if ( this.player_ ) {
    goog.DEBUG && console.log('Disposing Player');
    this.player_.exitDocument();
  }
}
*/