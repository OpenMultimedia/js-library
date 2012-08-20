goog.provide('openmultimedia.componentes.TwitterWrapper')

goog.require('goog.ui.Component')
goog.require('openmultimedia.componentes.TwitterWrapperTemplates')
goog.require('openmultimedia.configuration')
goog.require('openmultimedia.externals.twitter')

openmultimedia.externals.twitter.requireWidgetLib()

openmultimedia.componentes.TwitterWrapper = function (medio, options, localization, opt_domHelper) {
    this.medio_ = medio

    this.options_ = options;

    this.localization_ = localization;

    this.widgetid_ = 'tw-' + goog.getUid(this);

    goog.base(this, opt_domHelper)
}

goog.inherits(openmultimedia.componentes.TwitterWrapper, goog.ui.Component)

openmultimedia.componentes.TwitterWrapper.prototype.createDom = function () {
    var lang = this.medio_.getLanguageCode()

    this.element_ = soy.renderAsFragment(
        openmultimedia.componentes.TwitterWrapperTemplates.container
        ,{ widget_id: this.widgetid_, localization: this.localization_[lang] }
    )

    this.titleElement_ = goog.dom.getElementByClass(goog.getCssName("openmultimedia-componentes-twitterwrapper-title"), this.element_)

    this.contentElement_ = goog.dom.getElementByClass(goog.getCssName("openmultimedia-componentes-twitterwrapper-content"), this.element_)
}

openmultimedia.componentes.TwitterWrapper.prototype.enterDocument = function () {
    this.widget_ = new TWTR.Widget(
        openmultimedia.configuration.complete(
            {'id': this.widgetid_ }
            ,this.options_.twitterOptions
        )
    )

    if ( this.options_.user ) {
        this.widget_.render().setUser(this.options_.user).start()
    } else {
        this.widget_.render().start()
    }

    goog.base(this, 'enterDocument')
}
