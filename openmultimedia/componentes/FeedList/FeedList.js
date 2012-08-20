goog.provide("openmultimedia.componentes.FeedList")

goog.require("openmultimedia.componentes.FeedListTemplates")
goog.require("openmultimedia.componentes.FeedListOptions")
goog.require("openmultimedia.componentes.FeedListLocalization")
goog.require('openmultimedia.componentes.FeedListItem')

goog.require("openmultimedia.externals.google.Loader.feeds")
goog.require("openmultimedia.configuration")
goog.require("goog.ui.Component")

openmultimedia.externals.google.Loader.feeds.requireLib("1")

openmultimedia.componentes.FeedList = function(medio, opt_options, opt_localization, opt_domHelper) {
    this.medio_ = medio;

    this.options_ = openmultimedia.configuration.complete(opt_options, openmultimedia.componentes.FeedListOptions)

    this.localization_ = openmultimedia.localization.extend(openmultimedia.componentes.FeedListLocalization, opt_localization)

    goog.base(this, opt_domHelper);
};

goog.inherits(openmultimedia.componentes.FeedList, goog.ui.Component);

openmultimedia.componentes.FeedList.prototype.createDom = function () {
    var lang = this.medio_.getLanguageCode()

    this.element_ = soy.renderAsFragment(openmultimedia.componentes.FeedListTemplates.container, {localization: this.localization_[lang]});
    this.titleElement_ = goog.dom.getElementByClass(goog.getCssName("openmultimedia-componentes-feedlist-title"), this.element_);
    this.contentElement_ = goog.dom.getElementByClass(goog.getCssName("openmultimedia-componentes-feedlist-content"), this.element_);
}

openmultimedia.componentes.FeedList.prototype.getContentElement = function() {
    return this.contentElement_;
}

openmultimedia.componentes.FeedList.prototype.enterDocument = function () {
    var feed_url = this.medio_.getFeedUrl( this.options_.site, this.options_.type )

    this.feed_ = new google.feeds.Feed(feed_url)

    this.feed_.setResultFormat(google.feeds.Feed.MIXED_FORMAT)

    this.feed_.setNumEntries(10);

    function onFeedLoad(result) {
        if ( ! result['error'] ) {
            this.displayFeeds(result['feed'])
        }
    }

    this.feed_.load(goog.bind(onFeedLoad, this))

    goog.base(this, 'enterDocument')
}

openmultimedia.componentes.FeedList.prototype.displayFeeds = function (feed) {
    this.removeChildren(true);

    /** @type {openmultimedia.componentes.FeedListItem}*/
    var feedItem;

    var entries = /** @type {Array} */ feed['entries'];

    for ( var i = 0; i < entries.length; i += 1 ) {
        feedItem = new openmultimedia.componentes.FeedListItem(entries[i], this.options_, this.getDomHelper());
        this.addChild(feedItem, true);
        //goog.events.listen(feedItem, goog.events.EventType.CLICK, this.onItemClick_);
    }
}
