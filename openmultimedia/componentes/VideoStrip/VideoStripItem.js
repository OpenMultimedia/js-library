goog.provide("openmultimedia.componentes.VideoStripItem");

goog.require("openmultimedia.componentes.VideoStripTemplates");
goog.require("openmultimedia.utils.TimeFormatter");
goog.require("goog.ui.Component");
goog.require("goog.events.EventType");

openmultimedia.componentes.VideoStripItem = function (dataItem, opt_domHelper) {
    this.data_ = dataItem;

    this.templateData_ = {
        titulo: dataItem["titulo"],
        thumbnail: dataItem["thumbnail_pequeno"],
        duracion: openmultimedia.utils.TimeFormatter.formatDuration(dataItem["duracion"])
    }

    this.onClick_ = goog.bind(this.onClick_, this);

    goog.base(this, opt_domHelper);
}

goog.inherits(openmultimedia.componentes.VideoStripItem, goog.ui.Component);

openmultimedia.componentes.VideoStripItem.prototype.getClipData = function() {
    return this.data_;
}

openmultimedia.componentes.VideoStripItem.prototype.createDom = function() {
    this.element_ = soy.renderAsFragment(openmultimedia.componentes.VideoStripTemplates.item, this.templateData_);
}

openmultimedia.componentes.VideoStripItem.prototype.enterDocument = function () {
    goog.events.listen(this.element_, goog.events.EventType.CLICK, this.onClick_);

    goog.base(this, "enterDocument");
}

openmultimedia.componentes.VideoStripItem.prototype.exitDocument = function () {
    goog.events.unlisten(this.element_, goog.events.EventType.CLICK, this.onClick_);

    goog.base(this, "exitDocument");
}

openmultimedia.componentes.VideoStripItem.prototype.onClick_ = function (event) {
    this.dispatchEvent(new goog.events.Event(goog.events.EventType.CLICK));
}
