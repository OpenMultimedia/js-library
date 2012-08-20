goog.provide("openmultimedia.componentes.FeedListItem");

goog.require("openmultimedia.componentes.FeedListTemplates");
goog.require("openmultimedia.utils.TimeFormatter");
goog.require("goog.ui.Component");
goog.require("goog.events.EventType");

openmultimedia.componentes.FeedListItem = function (feedItem, feedListOptions, opt_domHelper) {
    this.data_ = feedItem;
    this.feedListOptions_ = feedListOptions;

    var templateData = {
        titulo: feedItem['title']
        ,url: feedItem['xmlNode'].getElementsByTagName('link').item(0).getAttribute('href')
    }

    if ( feedListOptions['show_content'] ) {
        if ( feedListOptions['show_content'] == 'snippet' ) {
            templateData.contenido = feedItem['contentSnippet']
        } else {
            templateData.contenido = feedItem['content']
        }
    } else {
        templateData.contenido = false
    }

    this.templateData_ = templateData

    //this.onClick_ = goog.bind(this.onClick_, this);

    goog.base(this, opt_domHelper)
}

goog.inherits(openmultimedia.componentes.FeedListItem, goog.ui.Component);

openmultimedia.componentes.FeedListItem.prototype.getClipData = function() {
    return this.data_
}

openmultimedia.componentes.FeedListItem.prototype.createDom = function() {
    this.element_ = soy.renderAsFragment(openmultimedia.componentes.FeedListTemplates.item, this.templateData_)
}

openmultimedia.componentes.FeedListItem.prototype.enterDocument = function () {
    //goog.events.listen(this.element_, goog.events.EventType.CLICK, this.onClick_);

    goog.base(this, "enterDocument")
}

openmultimedia.componentes.FeedListItem.prototype.exitDocument = function () {
    //goog.events.unlisten(this.element_, goog.events.EventType.CLICK, this.onClick_);

    goog.base(this, "exitDocument")
}

openmultimedia.componentes.FeedListItem.prototype.onClick_ = function (event) {
    this.dispatchEvent(new goog.events.Event(goog.events.EventType.CLICK))
}
