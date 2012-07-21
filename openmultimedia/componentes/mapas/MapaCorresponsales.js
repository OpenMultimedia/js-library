goog.provide('openmultimedia.componentes.mapas.MapaCorresponsales');

goog.require('openmultimedia.externals');
goog.require('openmultimedia.externals.google.maps');
goog.require('openmultimedia.api.utils');
goog.require('openmultimedia.api.ManejadorApi');
goog.require('openmultimedia.localization');
goog.require('openmultimedia.utils');

goog.require('openmultimedia.componentes.mapas.ClipInfoWindow');
goog.require('openmultimedia.componentes.mapas.ButtonListFilter');
goog.require('goog.dom');
goog.require('goog.object');
goog.require('goog.ui.Component');

openmultimedia.externals.google.maps.requireLib();

//TODO: (arv) Separar el funcionamiento del Mapa Genérico del Mapa de Corresponsales

/**
 * Constructor para un Mapa de Corresponsales.
 * @constructor
 * @abstract
 * @extends {goog.ui.Component}
 */
openmultimedia.componentes.mapas.MapaCorresponsales = function(medio, opt_opciones, opt_domHelper) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.MapaCorresponsales.constructor');

  goog.DEBUG && console.log('Construyendo Mapa Multimedia en: ');

  this.medio_ = medio;

  this.controls_  = [];

  this.setOptions(opt_opciones);

  goog.DEBUG && console.log('Creando el Manejador del API');
  this.manejadorApi_ = new openmultimedia.api.ManejadorApi(this.medio_, this.options_['lang']);

  goog.DEBUG && console.groupEnd();

  goog.base(this, opt_domHelper);
}

goog.inherits(openmultimedia.componentes.mapas.MapaCorresponsales, goog.ui.Component);

/**
 * Medio sobre el que se creará el Mapa
 * @type {openmultimedia.Medio}
 */
openmultimedia.componentes.mapas.MapaCorresponsales.prototype.medio_ = null;

/**
 * Manejador del API RESt
 * @type {openmultimedia.api.ManejadorApi}
 */
openmultimedia.componentes.mapas.MapaCorresponsales.prototype.manejadorApi_ = null;

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.apiRequest_ = null;

/**
 * Mapa de Google
 * @type {google.maps.Map}
 **/
openmultimedia.componentes.mapas.MapaCorresponsales.prototype.map_ = null;

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.selector_ = null;

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.selectorOptions_ = {
  'defaultItem': '',
  'items': [],
  'localization': {}
};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.clipInfoWindow_ = null;

/**
 * Lista de marcadores en el mapa
 * @type {Array.<google.maps.Marker>}
 */
openmultimedia.componentes.mapas.MapaCorresponsales.prototype.markerList_ = [];

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.pushpinIcon_ = null;
openmultimedia.componentes.mapas.MapaCorresponsales.prototype.pushpinShadow_ = null;
openmultimedia.componentes.mapas.MapaCorresponsales.prototype.pushpinShape_ = null;

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.options_ = {
  'lang': '',
  'regionDefault': ''
};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.mapOptions_ = {};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.apiParams_ = {};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.infowindowOptions_ = {};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.pushpinOptions_ = {};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.regionesMap_ = {};
openmultimedia.componentes.mapas.MapaCorresponsales.prototype.regionesOptions_ = {};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.setRegionesOptions = function(regiones) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.MapaCorresponsales.setRegionesOptions');
  //TODO (arv): Si el nombre del área no es un objeto cuyas llaves sean los lenguajes,
  // debería considerarse que ese mismo nombre es igual para cada lenguaje soportado
  // por el medio.
  //TODO (arv):  Validar que la localización abarque todas las regiones

  this.regionesOptions_ = regiones;

  var region;
  var regionesMap = {};

  for ( var i = 0; i < regiones.regiones.length; i += 1 ) {
    region = regiones.regiones[i];

    regionesMap[ regiones.regiones[i].slug ] = region;
    regionesMap[ regiones.regiones[i].slug ].index = i;
  }

  // Registra el shortcut para buscar las regiones por slug
  goog.DEBUG && console.log('Map', regionesMap);
  this.regionesMap_ = regionesMap;
  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.setOptions = function(options) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.MapaCorresponsales.setOptions');

  goog.DEBUG && console.log('Setting Multimedia Map Options:', options);

  // Si options no es un objeto,
  if ( typeof options != 'object' ) {
    goog.DEBUG && console.groupEnd('El objecto de Opciones es inválido');
    return;
  }

  // Separando regiones
  var newRegionesOptions = openmultimedia.configuration.retrieve(options, 'regionesOptions');

  // Separando nueva Localizacion
  var newLocalization = openmultimedia.configuration.retrieve(options, 'localization');

  // Separando Opciones de Google Map
  var newMapOptions = openmultimedia.configuration.retrieve(options, 'mapOptions');

  // Separando Opciones de Google Map
  var newApiParams = openmultimedia.configuration.retrieve(options, 'apiParams');

  // Separando Opciones de
  var newInfoWindowOptions = openmultimedia.configuration.retrieve(options, 'infowindowOptions');

  // Separando PushPin
  var newPushpinOptions = openmultimedia.configuration.retrieve(options, 'pushpinOptions');

  // Separando SelectorOptions
  var newSelectorOptions = openmultimedia.configuration.retrieve(options, 'selectorOptions');

  var controlsList = openmultimedia.configuration.retrieve(options, 'controls');

  // Asignando nueva configuración principal
  this.setMainOptions( options );

  // Asignando nuevas opciones de region
  if ( newRegionesOptions ) {
    this.setRegionesOptions(newRegionesOptions);
  }

  // Asignando Nueva Localizacion
  if ( newLocalization ) {
    this.setLocalizacion( newLocalization );
  }

  // Asignando nueva configuración del Mapa
  if ( newMapOptions ) {
    this.setMapOptions( newMapOptions );
  }

  if ( newApiParams ) {
    this.setApiParams( newApiParams );
  }

  if ( newInfoWindowOptions ) {
    this.setInfoWindowOptions( newInfoWindowOptions );
  }

  if ( newPushpinOptions ) {
    this.setPushpinOptions( newPushpinOptions );
  }

  if ( newSelectorOptions ) {
    this.setSelectorOptions( newSelectorOptions );
  }

  if ( controlsList ) {
    this.setControls( controlsList );
  }

  goog.DEBUG && console.groupEnd();
}

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.setMainOptions = function (options) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.MapaCorresponsales.setMainOptions');

  goog.DEBUG && console.log('Asignando opciones principales', options);

  var fullOptions = openmultimedia.configuration.complete(options, this.options_);

  // Se validan las configuraciones pertenecientes a las opciones específicas de Multimedia
  if ( 'lang' in fullOptions && ! this.medio_.isValidLanguage( fullOptions['lang'] ) ) {
    // Se verifica que el lenguaje se haya indicado y que sea un lenguaje válido
    fullOptions['lang'] = this.medio_.getDefaultLanguage();
  }

  goog.DEBUG && console.log('Opciones asignadas', fullOptions);

  this.options_ = fullOptions;
  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.setApiParams = function (apiParams) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.MapaCorresponsales.setApiParams');

  var fullApiParams = openmultimedia.configuration.complete(apiParams, this.apiParams_);

  // Se corrigen los parámetros obligatorios
  if (fullApiParams['detalle'] != openmultimedia.api.DetalleClip.COMPLETO) {
    fullApiParams['detalle'] = openmultimedia.api.DetalleClip.COMPLETO;
  }

  this.apiParams_ = fullApiParams;

  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.setMapOptions = function(mapOptions) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.MapaCorresponsales.setMapOptions');

  var fullMapOptions = openmultimedia.configuration.complete(mapOptions, this.mapOptions_);

  // Se eliminan las configuraciones que no se requieren porque se inyectarán al inicializar el mapa
  if ('mapTypeId' in fullMapOptions) {
    delete fullMapOptions['mapTypeId'];
  }

  if ('center' in fullMapOptions) {
    delete fullMapOptions['center'];
  }

  goog.DEBUG && console.log('Setting MapOptions', mapOptions);
  this.mapOptions_ = mapOptions;

  goog.DEBUG && console.groupEnd();
}

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.setInfoWindowOptions = function (infowindowOptions) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.MapaCorresponsales.setInfoWindowOptions');

  goog.DEBUG && console.log(arguments);

  var fullInfowindowOptions = openmultimedia.configuration.complete(infowindowOptions, this.infowindowOptions_);

  // Ellenguaje del InfoWindow ssiempre debe ser igual al lenguaje del mapa
  fullInfowindowOptions['lang'] = this.options_['lang'];

  this.infowindowOptions_ = fullInfowindowOptions;

  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.setPushpinOptions = function( options ) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.MapaCorresponsales.setPushpinOptions');

  this.pushpinIcon_ = openmultimedia.externals.google.maps.makeMarkerImage( options.icon );
  this.pushpinShadow_ = openmultimedia.externals.google.maps.makeMarkerImage( options.shadow );
  this.pushpinShape_ = openmultimedia.externals.google.maps.makeMarkerShape( options.shape);

  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.setSelectorOptions = function( options ) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.MapaCorresponsales.setSelectorOptions');

  var fullOptions = openmultimedia.configuration.complete(options, this.selectorOptions_);

  fullOptions['lang'] = this.options_['lang'];

  this.selectorOptions_ = fullOptions;

  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.setLocalization = function( localization ) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.MapaCorresponsales.setLocalization');
  this.localization_ = openmultimedia.localization.extend( this.localization_, localization );
  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.setControls = function (controlList) {
    var currentControl;

    for ( var i = 0; i < controlList.length; i += 1) {
        currentControl = controlList[i];

        this.controls_.push(currentControl);

        goog.events.listen(currentControl, goog.events.EventType.CHANGE, goog.bind(this.reload, this));
    }
}

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.toggleInfoWindow_ = function (marker, dataList) {
  this.clipInfoWindow_.close();

  if ( this.clipInfoWindow_.getCurrentMarker() != marker ) {
    this.clipInfoWindow_.setDataList( dataList );
    this.clipInfoWindow_.open( marker );
  }
}

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.getTileUrl_ = function(regionId, tileUrlTemplate, coords, zoom) {
  var normalizedCoords = openmultimedia.componentes.mapas.MapaCorresponsales.getNormalizedCoord_(coords, zoom);
  if (!normalizedCoords) {
    return null;
  }

  var url = tileUrlTemplate
      .replace('{base-path}', this.options_['base_path'])
      .replace('{region-id}', regionId)
      .replace('{zoom}', zoom)
      .replace('{coord-x}', normalizedCoords.x)
      .replace('{coord-y}', normalizedCoords.y);

  return url;
}

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.reload = function() {
  if ( this.apiRequest_ ) {
    goog.DEBUG && console.log('Cancelando petición anterior al API');
    this.apiRequest_.cancel();
  }

  this.clearInfo();

  var apiParams = goog.object.clone(this.apiParams_);

  var region = this.map_.getMapTypeId();

  if (region in this.regionesMap_ ) {
    var currentRegion = this.regionesMap_[region];

    if ( currentRegion.apiParams ) {
      goog.object.extend(apiParams, currentRegion.apiParams);
    }
  }

  if ( this.options_["selector"] ) {
    var itemSelected = this.selector_.getSelectedItem();

    if ( itemSelected && itemSelected.apiParams) {
      goog.object.extend(apiParams, itemSelected.apiParams);
    }
  }

  if ( this.controls_ ) {
    for ( var i = 0; i < this.controls_.length; i += 1) {
      goog.object.extend(apiParams, this.controls_[i].getApiParams());
    }
  }

  function onApiResult(data) {
    this.setInfo(data);
    this.apiRequest_ = null;
  }

  function onApiError() {
    goog.DEBUG && console.error('Timeout consultando al API');
    this.apiRequest_ = null;
  }

  this.apiRequest_ = this.manejadorApi_.loadClips(apiParams, goog.bind(onApiResult, this), goog.bind(onApiError, this));
};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.clearInfo = function() {
  for ( var i = 0; i < this.markerList_.length; i += 1 ) {
    this.markerList_[i].setMap(null);
  }

  this.markerList_ = [];
}

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.setInfo = function (clipData) {
  goog.DEBUG && console.log('Setting info:', clipData);
  var i;
  var clipDataClean = {};
  var geotag;
  var markerOptions;
  var dataList;
  var geoArray;

  this.clearInfo();

  for ( i = 0; i < clipData.length; i += 1 ) {
    geotag = clipData[i]['geotag'] ? clipData[i]['geotag'] : ( clipData[i]['pais'] ? clipData[i]['pais']['geotag'] : null);

    if ( geotag == null ) {
      continue;
    }

    if (! (geotag in clipDataClean) ) {
      clipDataClean[geotag] = [];
    }

    clipDataClean[geotag].push(clipData[i]);
  }

  for (geotag in clipDataClean) {
    dataList = clipDataClean[geotag];

    geoArray = geotag.split(',');

    markerOptions =  {
      'title': openmultimedia.api.utils.formatPlace(dataList[0]),
      'icon': this.pushpinIcon_,
      'shadow': this.pushpinShadow_,
      'shape': this.pushpinShape_,
      'animation': google.maps.Animation.DROP,
      'position': openmultimedia.externals.google.maps.makeLatLng({lat: geoArray[0], lng: geoArray[1]}),
      'map': this.map_
    }

    var tmpMarker = new google.maps.Marker(markerOptions);
    this.markerList_.push( tmpMarker );

    google.maps.event.addListener(tmpMarker, 'click', goog.partial( this.onMarkerClick_, this, dataList ) );
  }
}

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.onMarkerClick_ = function(mapa, dataList, mouseEvent) {
  mapa.toggleInfoWindow_(this, dataList);
};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.getGoogleMap = function () {
  return this.map_;
};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.getRegion = function (regionId) {
  if ( regionId in this.regionesMap_ ) {
    return this.regionesMap_[regionId];
  }

  return null;
}

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.registerControl_ = function(control) {
    goog.events.listen(control, "change", function() {

    });
}

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.createDom = function () {
  this.element_ = goog.dom.createDom('div', {style: 'width: 100%; height: 100%;'});
};

openmultimedia.componentes.mapas.MapaCorresponsales.prototype.enterDocument = function () {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.MapaCorresponsales.enterDocument');

  goog.dom.classes.add(this.element_, goog.getCssName('openmultimedia-componentes-mapa-contenedor'));

  goog.DEBUG && console.log('Creando el InfoWindow');

  this.clipInfoWindow_ = new openmultimedia.componentes.mapas.ClipInfoWindow(this.element_, this.infowindowOptions_);

  goog.DEBUG && console.log("Construyengo Google Map en ", this.element_, "con las opciones", this.mapOptions_);

  // Creamos el mapa vacío
  this.map_ = new google.maps.Map(this.element_, this.mapOptions_);

  var mapTypeList = [], mapType, tileSize, region, tileUrlTemplate;


    if ( this.options_["regiones"] ) {
        goog.DEBUG && console.log(this.regionesOptions_);

        var globalTileSize = openmultimedia.externals.google.maps.makeSize(this.regionesOptions_.global.tileSize);

        var lang = this.options_['lang'];

        for (var i = 0; i < this.regionesOptions_.regiones.length; i += 1) {
          region = this.regionesOptions_.regiones[i];

          tileSize = region.tileSize ? openmultimedia.externals.google.maps.makeSize(region.tileSize) : globalTileSize;
          tileUrlTemplate = region.tileUrlTemplate ? region.tileUrlTemplate : this.regionesOptions_.global.tileUrlTemplate;

          mapType = {
            'name': this.regionesOptions_.localization[lang][ region.slug ].nombre,
            'getTileUrl': goog.bind(this.getTileUrl_, this,  region.slug, tileUrlTemplate),
            'tileSize': tileSize,
            'maxZoom': ( region.zoom && region.zoom.max ) ? region.zoom.max : this.regionesOptions_.global.defaultZoom.max,
            'minZoom': ( region.zoom && region.zoom.min ) ? region.zoom.min : this.regionesOptions_.global.defaultZoom.min
          };

          this.map_.mapTypes.set(region.slug, new google.maps.ImageMapType( mapType ) );
          mapTypeList[i] = region.slug;
        }
    }

  // Se calculan las opciones para el control de tipo de mapas
  var mapOptions = goog.object.clone(this.mapOptions_);

  if ( typeof mapOptions['mapTypeControlOptions'] == 'object' ) {
    mapOptions['mapTypeControlOptions'] = goog.object.clone( mapOptions['mapTypeControlOptions'] );
  } else {
    mapOptions['mapTypeControlOptions'] = {};
  }

  mapOptions['mapTypeControlOptions']['mapTypeIds'] = mapTypeList;

  if ( this.options_["regiones"] ) {
    var regionDefault = this.options_['regionDefault'];
    var regionId;

    if ( ( ! regionDefault ) || ( ! regionDefault in this.regionesMap_ ) ) {
      regionDefault = mapTypeList[0];
    }

    mapOptions['mapTypeId'] = regionDefault;

    var regionInicial = this.regionesMap_[regionDefault];

    mapOptions['center'] = openmultimedia.externals.google.maps.makeLatLng(regionInicial.center ? regionInicial.center : this.regionesOptions_.global.defaultCenter);

    /**
     * Procesa
     * @param {openmultimedia.componentes.mapas.MapaCorresponsales} mapaMultimedia
     * @this {google.maps.Map}
     */
    var onMapTypeIdChanged = function(mapaMultimedia) {
      var newMapType = this.getMapTypeId();

      var region = mapaMultimedia.getRegion(newMapType);

      if ( region && region.center) {
        var coords = openmultimedia.externals.google.maps.makeLatLng(region.center);
        this.panTo( coords );
      }

      mapaMultimedia.reload();
    };

    google.maps.event.addListener(this.map_, "maptypeid_changed", goog.partial(onMapTypeIdChanged, this));
  }

  goog.DEBUG && console.log('Final opts', mapOptions);

  if ( this.options_["selector"] ) {
    this.selector_ = new openmultimedia.componentes.mapas.ButtonListFilter(this, this.selectorOptions_);

    if ( ! this.options_['selector'] ) {
      goog.style.showElement(this.selector_.element_, false);
    }

    goog.events.listen(this.selector_, openmultimedia.componentes.mapas.ButtonListFilter.EventType.CHANGE, goog.bind(this.reload, this));
  }

  this.map_.setOptions(mapOptions);

  goog.DEBUG && console.groupEnd();

  goog.base(this, 'enterDocument');
};

openmultimedia.componentes.mapas.MapaCorresponsales.getNormalizedCoord_ = function(coord, zoom) {
  var y = coord.y, x = coord.x, tileRange;

  // tile range in one direction range is dependent on zoom level
  // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
  tileRange = (1 << zoom);

  // don't repeat across y-axis (vertically)
  if (y < 0 || y >= tileRange) {
    return null;
  }

  // repeat across x-axis
  if (x < 0 || x >= tileRange) {
    x = (x % tileRange + tileRange) % tileRange;
  }

  return { x: x, y: y };
};
