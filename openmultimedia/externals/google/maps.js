goog.provide('openmultimedia.externals.google.maps');

goog.require('openmultimedia.externals');

/** @define {boolean} Define si se usará el sensor para Google Maps o no */
openmultimedia.externals.google.maps.DEFAULT_USE_SENSOR = false;

openmultimedia.externals.google.maps.included_ = false;


openmultimedia.externals.google.maps.requireLib = function (opt_sensor) {
  // Se valida que la biblioteca no haya sido incluida
  if ( ! openmultimedia.externals.google.maps.included_ && (typeof google == 'undefined' || ! google.maps) ) {
    var useSensor = opt_sensor !== undefined ? opt_sensor : openmultimedia.externals.google.maps.DEFAULT_USE_SENSOR;
    var libUrl = 'https://maps.google.com/maps/api/js?sensor=' + ( useSensor ? 'true' : 'false' );

    goog.DEBUG && console.info('Inyectando dependencia de Biblioteca JavaScript de Google Maps: ', libUrl);
    openmultimedia.externals.inject(libUrl);
    openmultimedia.externals.google.maps.included_ = true;
  }
}

openmultimedia.externals.google.maps.makeMarkerImage = function (markerDescriptor, opt_basePath) {
  return new google.maps.MarkerImage(
    opt_basePath ? markerDescriptor['url'].replace('{base-path}', opt_basePath): markerDescriptor.url,
    openmultimedia.externals.google.maps.makeSize( markerDescriptor.size ),
    openmultimedia.externals.google.maps.makePoint( markerDescriptor.origin ),
    openmultimedia.externals.google.maps.makePoint( markerDescriptor.anchor )
  );
};

openmultimedia.externals.google.maps.makeLatLng = function(latLngDescriptor) {
  return new google.maps.LatLng(latLngDescriptor.lat, latLngDescriptor.lng);
};

openmultimedia.externals.google.maps.makeLatLngBounds = function(latLngBoundsDescriptor) {
    return new google.maps.LatLngBounds(
        openmultimedia.externals.google.maps.makeLatLng(latLngBoundsDescriptor.sw)
        ,openmultimedia.externals.google.maps.makeLatLng(latLngBoundsDescriptor.ne)
    )
}

openmultimedia.externals.google.maps.makeSize = function(sizeDescriptor) {
  return new google.maps.Size(sizeDescriptor.width, sizeDescriptor.height);
};

openmultimedia.externals.google.maps.makePoint = function(pointDescriptor) {
  return new google.maps.Point(pointDescriptor.x, pointDescriptor.y);
};

openmultimedia.externals.google.maps.makeMarkerShape = function(shapeDescriptor) {
  var shape = {
    'coord': shapeDescriptor.coord,
    'type': shapeDescriptor.type
  };

  goog.DEBUG && console.log('Making Shape from ', shapeDescriptor, shape);

  return shape;
};
