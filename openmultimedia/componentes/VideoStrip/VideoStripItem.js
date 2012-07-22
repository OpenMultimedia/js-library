goog.provide("openmultimedia.componentes.VideoStripItem");

goog.require("openmultimedia.componentes.VideoStripTemplates");
goog.require("openmultimedia.utils.TimeFormatter");
goog.require("goog.ui.Component");

openmultimedia.componentes.VideoStripItem = function (dataItem, opt_domHelper) {
    console.log("Cargando datos en Item: ", dataItem);

    this.templateData_ = {
        titulo: dataItem["titulo"],
        thumbnail: dataItem["thumbnail_pequeno"],
        duracion: openmultimedia.utils.TimeFormatter.formatDuration(dataItem["duracion"])
    }

    goog.base(this, opt_domHelper);
}

goog.inherits(openmultimedia.componentes.VideoStripItem, goog.ui.Component);

openmultimedia.componentes.VideoStripItem.prototype.createDom = function() {
    this.element_ = soy.renderAsFragment(openmultimedia.componentes.VideoStripTemplates.item, this.templateData_);
}

openmultimedia.componentes.VideoStripItem.prototype.enterDocument = function () {

}
