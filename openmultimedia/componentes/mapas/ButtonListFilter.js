goog.provide('openmultimedia.componentes.mapas.ButtonListFilter');

goog.require('goog.dom');
goog.require('openmultimedia.configuration');
goog.require('openmultimedia.componentes.mapas.ButtonListFilterTemplates');
goog.require('goog.ui.decorate');
goog.require('goog.ui.FlatButtonRenderer');
goog.require('goog.array');
goog.require('goog.debug.ErrorHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.events');
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.CustomButtonRenderer');
goog.require('goog.ui.ToggleButton');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
openmultimedia.componentes.mapas.ButtonListFilter = function (mapaMultimedia, options) {
  this.mapaMultimedia_ = mapaMultimedia;

  this.setOptions(options);

  this.createDom();

  var googleMap = this.mapaMultimedia_.getGoogleMap();

  googleMap.controls[this.options_['position']].push(this.node_);
};

goog.inherits(openmultimedia.componentes.mapas.ButtonListFilter, goog.events.EventTarget);

openmultimedia.componentes.mapas.ButtonListFilter.prototype.node_ = null;

openmultimedia.componentes.mapas.ButtonListFilter.prototype.options_ = {
  'lang': {},
  'defaultItem': '',
  'position': 11 // google.maps.ControlPosition.BOTTOM
};

openmultimedia.componentes.mapas.ButtonListFilter.prototype.items_ = [];

openmultimedia.componentes.mapas.ButtonListFilter.prototype.localization_ = {};

openmultimedia.componentes.mapas.ButtonListFilter.prototype.selectedButton_ = null;

openmultimedia.componentes.mapas.ButtonListFilter.prototype.selectedItem_ = null;

openmultimedia.componentes.mapas.ButtonListFilter.prototype.setOptions = function (options) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.ButtonListFilter.setOptions', options);

  var newOptions = goog.object.clone(options);

  var newItems = openmultimedia.configuration.retrieve(newOptions, 'items');

  var newLocalization = openmultimedia.configuration.retrieve(newOptions, 'localization');

  this.setMainOptions(newOptions);

  this.setItems(newItems);

  this.setLocalization(newLocalization);

  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.mapas.ButtonListFilter.prototype.setMainOptions = function (options) {
  var newOptions = openmultimedia.configuration.complete(options, this.options_);

  this.options_ = newOptions;
};

openmultimedia.componentes.mapas.ButtonListFilter.prototype.setItems = function (itemList) {
  //TODO (arv): Validations
  this.items_ = itemList;
};

openmultimedia.componentes.mapas.ButtonListFilter.prototype.setLocalization = function (localization) {
  var fullLocalization = openmultimedia.localization.extend(this.localization_, localization);

  this.localization_ = fullLocalization;
};

openmultimedia.componentes.mapas.ButtonListFilter.prototype.createDom = function () {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.ButtonListFilter.createDom');
  var lang = this.options_['lang'];

  var idPrefix = openmultimedia.componentes.mapas.ButtonListFilter.ID_PREFIX;

  this.node_ = soy.renderAsElement(openmultimedia.componentes.mapas.ButtonListFilterTemplates.container, {classes: {
    button: goog.getCssName('goog-toggle-button'),
    buttonCollapseRight: goog.getCssName('goog-custom-button-collapse-right'),
    buttonCollapseLeft: goog.getCssName('goog-custom-button-collapse-left')
  }, idPrefix: idPrefix, items: this.items_, localization: this.localization_[lang]});

  var domButtons = (goog.dom.getElementsByClass(goog.getCssName('openmultimedia-componentes-mapa-buttonlistfilter-item'), this.node_));

  this.buttons_ = [];

  var tmpButton, tmpItem, tmpDefaultButton;

  for (var i = 0; i < domButtons.length; i += 1) {
    tmpButton = goog.ui.decorate(domButtons[i]);
    tmpItem = this.items_[i]; // Dado que se pasa este arreglo en orden a la plantilla para generar los botones, se considera que los botones vienen en ese orden

    goog.events.listen(tmpButton, goog.ui.Component.EventType.ACTION, goog.bind(this.onButtonClick_, this, tmpItem));

    this.buttons_[i] = tmpButton;

    if ( tmpItem.slug == this.options_['defaultItem'] ) {
      tmpDefaultButton = tmpButton;
    }
  }

  if (!tmpDefaultButton && this.buttons_.length > 0) {
    tmpDefaultButton = this.buttons_[0];
  }

  if (tmpDefaultButton) {
    goog.events.dispatchEvent(tmpDefaultButton, goog.ui.Component.EventType.ACTION);
  }

  goog.DEBUG && console.groupEnd();
};

openmultimedia.componentes.mapas.ButtonListFilter.prototype.getSelectedItem = function () {
  return this.selectedItem_;
};

openmultimedia.componentes.mapas.ButtonListFilter.prototype.onButtonClick_ = function(item, event) {
  goog.DEBUG && console.groupCollapsed('openmultimedia.componentes.mapas.ButtonListFilter.prototype.onButtonClick_', arguments);

  if ( this.selectedButton_ == event.target ) {
    if ( this.selectedButton_ ) {
      this.selectedButton_.setChecked(true);
    }
    return;
  }

  if ( this.selectedButton_ ) {
    this.selectedButton_.setChecked(false);
  }

  this.selectedButton_ = event.target;
  this.selectedButton_.setChecked(true);

  this.selectedItem_ = item;

  this.dispatchEvent(new goog.events.Event(openmultimedia.componentes.mapas.ButtonListFilter.EventType.CHANGE));

  goog.DEBUG && console.groupEnd();
}

openmultimedia.componentes.mapas.ButtonListFilter.ID_PREFIX = goog.getCssName('openmultimedia-componentes-mapas-buttonlistfilter-item');

openmultimedia.componentes.mapas.ButtonListFilter.EventType = {
  CHANGE: 'change'
};