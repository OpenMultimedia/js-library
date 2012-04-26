goog.provide('openmultimedia.componentes.SelectFilter');

goog.require('goog.ui.Select');
goog.require('goog.ui.Option');
goog.require('goog.events.EventType');
goog.require('openmultimedia.localization');
goog.require('openmultimedia.utils');

openmultimedia.componentes.SelectFilter = function (node, options) {
  this.node_ = node;

  this.setOptions(options);

  this.render();
};

openmultimedia.componentes.SelectFilter.prototype.node_ = null;

openmultimedia.componentes.SelectFilter.prototype.defaultItem_ = '';

openmultimedia.componentes.SelectFilter.prototype.items_ = [];

openmultimedia.componentes.SelectFilter.prototype.itemFilterMap_ = {};

openmultimedia.componentes.SelectFilter.prototype.localization_ = {
  'es': {},
  'en': {},
  'pt': {}
};

openmultimedia.componentes.SelectFilter.prototype.selectControl_ = null;

openmultimedia.componentes.SelectFilter.prototype.setOptions = function (options) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.SelectFilter.setOptions');

  goog.DEBUG && console.log('Setting options', options);

  if ( ! options ) {
    return;
  }

  var newLocalization = openmultimedia.utils.retrieveSubOptions(options, 'localization');

  this.setMainOptions(options);

  if ( newLocalization ) {
    this.setLocalization(newLocalization);
  }

  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.SelectFilter.prototype.setMainOptions = function (options) {
  var newItems = options['items'];

  this.items_ = newItems;
  this.itemFilterMap_ = {};

  var currentItem;

  for (var i = 0; i < newItems.length; i += 1 ) {
    currentItem = newItems[i];
    goog.DEBUG && console.log('Adding item: ', currentItem);
    this.itemFilterMap_[ currentItem['slug'] ] = currentItem;
  }

  var fullOptions = openmultimedia.utils.completeOptions(this.options_, options);

  this.options_ = fullOptions;
};

openmultimedia.componentes.SelectFilter.prototype.setLocalization = function (localization) {
  var newLocalization = openmultimedia.localization.extend(this.localization_, localization);

  this.localization_ = newLocalization;
}

openmultimedia.componentes.SelectFilter.prototype.render = function () {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.SelectFilter.render');

  goog.DEBUG && console.log( 'Setting items', this.items_ );

  this.selectControl_ = new goog.ui.Select();

  var currentItem;

  for ( var i = 0; i < this.items_.length; i += 1 ) {
    currentItem = this.items_[i];
    this.selectControl_.addItem( new goog.ui.Option( currentItem['slug'] ) );
  }

  goog.events.listen( this.selectControl_, goog.events.EventType.CHANGE, this.onSelectChange_ );

  goog.DEBUG && console.log( 'LeNodei', this.node_, this.selectControl_ );

  this.selectControl_.render(this.node_);

  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.SelectFilter.prototype.onSelectChange_ = function (event) {
  goog.DEBUG && console.log('SelectChange', arguments);
}