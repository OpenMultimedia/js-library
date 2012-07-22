goog.provide("openmultimedia.componentes.VideoStrip")

goog.require("openmultimedia.componentes.VideoStripTemplates")
goog.require("openmultimedia.componentes.VideoStripItem")
goog.require("openmultimedia.componentes.VideoStripOptions")
goog.require("goog.ui.Component");
goog.require("openmultimedia.api.ManejadorApi");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.object");

/**
 * @constructor
 */
openmultimedia.componentes.VideoStrip = function(medio, opt_options, opt_domHelper) {
    this.medio_ = medio;

    this.options_ = openmultimedia.configuration.complete(opt_options, openmultimedia.componentes.VideoStripOptions);

    this.controls_ = this.options_.controls ? this.options_.controls : null;

    this.manejadorApi_ = new openmultimedia.api.ManejadorApi(medio, this.options_.lang);

    goog.base(this, opt_domHelper);
}

goog.inherits(openmultimedia.componentes.VideoStrip, goog.ui.Component);

openmultimedia.componentes.VideoStrip.prototype.createDom = function () {
    this.element_ = soy.renderAsFragment(openmultimedia.componentes.VideoStripTemplates.container, {localization: this.options_.localization[this.options_.lang]});
    //this.titleElement_ = goog.dom.getElementByClass(goog.getCssName("openmultimedia-componentes-videostrip-title"), this.element_);
    this.contentElement_ = goog.dom.getElementByClass(goog.getCssName("openmultimedia-componentes-videostrip-content"), this.element_);
}

openmultimedia.componentes.VideoStrip.prototype.getContentElement = function() {
    return this.contentElement_;
}

openmultimedia.componentes.VideoStrip.prototype.enterDocument = function () {
    goog.DEBUG && console.log("Intalling VideoStrip");

    for ( var i = 0; i < this.controls_.length; i += 1 ) {
        goog.events.listen(this.controls_[i], goog.events.EventType.CHANGE, goog.bind(this.onControlChange_, this));
    }

    this.reload();
}

openmultimedia.componentes.VideoStrip.prototype.onControlChange_ = function(event) {
    this.reload();
}

openmultimedia.componentes.VideoStrip.prototype.reload = function() {
    this.removeChildren(true);

    var apiParams = this.options_.api_params ? goog.object.clone(this.options_.api_params) : {};

    for ( var i = 0; i < this.controls_.length; i += 1 ) {
        goog.object.extend(apiParams, this.controls_[i].getApiParams());
    }

    this.manejadorApi_.loadClipList(apiParams, goog.bind(this.onLoadClips_, this));
}

openmultimedia.componentes.VideoStrip.prototype.onLoadClips_ = function(dataList) {
    goog.DEBUG && console.log("Clips loaded on Ultimos: ", dataList);

    /** @type {openmultimedia.componentes.VideoStripItem}*/
    var videoItem;
    for ( var i = 0; i < dataList.length; i += 1 ) {
        videoItem = new openmultimedia.componentes.VideoStripItem(dataList[i], this.getDomHelper());
        this.addChild(videoItem, true);
    }
}
