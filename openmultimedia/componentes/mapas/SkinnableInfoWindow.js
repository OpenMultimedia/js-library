goog.provide('openmultimedia.componentes.mapas.SkinnableInfoWindow');

goog.require('openmultimedia.componentes.mapas.SkinnableInfoWindowTemplates');
goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.events');
goog.require('goog.events.EventTarget');

/** @constructor */
openmultimedia.componentes.mapas.SkinnableInfoWindow = function () {
   this.node_ = soy.renderAsFragment( openmultimedia.componentes.mapas.SkinnableInfoWindowTemplates.container );
   this.windowNode_ = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-window'), this.node_);
   this.contentNode_ = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-window-content'), this.node_);
   this.closeButtonNode_ = goog.dom.getElementByClass(goog.getCssName('openmultimedia-infowindow-window-close-button'), this.node_);

   goog.events.listen(this.closeButtonNode_, 'click', goog.bind( this.onCloseClick_, this ));
}

goog.inherits(openmultimedia.componentes.mapas.SkinnableInfoWindow, goog.events.EventTarget);

/**
 * Description
 * @type {Element}
 */
openmultimedia.componentes.mapas.SkinnableInfoWindow.prototype.node_ = null;

openmultimedia.componentes.mapas.SkinnableInfoWindow.prototype.windowNode_ = null;

openmultimedia.componentes.mapas.SkinnableInfoWindow.prototype.contentNode_ = null;

openmultimedia.componentes.mapas.SkinnableInfoWindow.prototype.closeButtonNode_ = null;

openmultimedia.componentes.mapas.SkinnableInfoWindow.prototype.map_ = null;
openmultimedia.componentes.mapas.SkinnableInfoWindow.prototype.marker_ = null;
openmultimedia.componentes.mapas.SkinnableInfoWindow.prototype.container_ = null;
openmultimedia.componentes.mapas.SkinnableInfoWindow.prototype.content_ = null;

openmultimedia.componentes.mapas.SkinnableInfoWindow.prototype.setContent = function (content) {
   if ( this.content_ != content ) {
      goog.dom.removeChildren(this.contentNode_); // __windowContentNode.contents().detach();
      this.content_ = content;

      //TODO (arv): Validar otros tipos de contenido además de Nodos, como cadenas etc
      goog.dom.append(this.contentNode_, content);
      // content.show(); ?
   }

   this.adjustSize_();

   return true;
}

openmultimedia.componentes.mapas.SkinnableInfoWindow.prototype.open = function(map, marker) {
   this.map_ = map;
   this.marker_ = marker;

   this.container_ = map.getDiv();
   goog.dom.append(this.container_, this.node_);
   goog.style.showElement(this.node_, true);
   this.adjustSize_();

   return true;
}

openmultimedia.componentes.mapas.SkinnableInfoWindow.prototype.close = function () {
   if ( this.node_ ) {
      goog.style.showElement(this.node_, false );
   }

   return true;
 }

openmultimedia.componentes.mapas.SkinnableInfoWindow.prototype.adjustSize_ = function() {
   if ( ! this.content_ ) {
      return;
   }

   goog.DEBUG && console.log('Ajustando tamaño');

   var tmpContentSize = goog.style.getBorderBoxSize(this.contentNode_);
   var tmpMargins = goog.style.getMarginBox(this.contentNode_);

   tmpContentSize.width += ( tmpMargins.left + tmpMargins.right);
   tmpContentSize.height += ( tmpMargins.top + tmpMargins.bottom);

   goog.style.setSize(this.windowNode_, tmpContentSize);

   if ( this.container_ ) {
      var tmpContainerSize = goog.style.getBorderBoxSize( this.container_ );
      goog.style.setPosition( this.windowNode_, (tmpContainerSize.width - tmpContentSize.width) / 2, (tmpContainerSize.height - tmpContentSize.height) / 2 );
   }
}

openmultimedia.componentes.mapas.SkinnableInfoWindow.prototype.onCloseClick_ = function() {
   goog.DEBUG && console.log('Dispatching CloseClick');
   this.dispatchEvent(new goog.events.Event('closeclick', this));
   this.close();
};
