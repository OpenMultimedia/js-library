goog.provide("openmultimedia.componentes.VideoStripEvent");
goog.provide("openmultimedia.componentes.VideoStripEventType");

goog.require("goog.events.Event");

openmultimedia.componentes.VideoStripEvent = function(type, opt_videoStripItem, opt_target) {
    this.item = opt_videoStripItem;
    goog.base(this, type, opt_target);
}

goog.inherits(openmultimedia.componentes.VideoStripEvent, goog.events.Event);

openmultimedia.componentes.VideoStripEventType = {
    ITEM_CLICK: "item_click"
};
