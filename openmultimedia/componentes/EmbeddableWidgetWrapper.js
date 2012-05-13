goog.provide('openmultimedia.componentes.EmbeddableWidgetWrapper');

goog.require('goog.dom');
goog.require('goog.style');

/**
 * Clase base para un widget incrustable. Forma un objeto wrapper que realiza las
 * tareas básicas de un widget incrustable mediante un IFRAME como redimensionar
 * al tamaño del viewport y eliminar las barras de scroll del documento.
 * Utilizando el método {@code setComponent} se puede asignar un componente ya
 * inicializado (que herede de {@code goog.Component}) para que sea dibujado
 * dentro de este wrapper. Es importante que el componente asignado tenga una
 * lógica de redimensionamiento automático al tamaño de su contenedor para que
 * abarque el tamaño del wrapper.
 * @constructor
 */
openmultimedia.componentes.EmbeddableWidgetWrapper = function(document, element) {
    this.document_ = document;

    this.element_ = goog.dom.getElement(element);

    this.applyStyles_();
}

openmultimedia.componentes.EmbeddableWidgetWrapper.prototype.document_ = null;

openmultimedia.componentes.EmbeddableWidgetWrapper.prototype.element_ = null;

openmultimedia.componentes.EmbeddableWidgetWrapper.prototype.applyStyles_ = function () {
    if ( this.document_ && this.element_ ) {

        this.document_.body.style.overflow = 'hidden';

        this.element_.style.position = 'fixed';

        this.adjustSize_();
    }
};

openmultimedia.componentes.EmbeddableWidgetWrapper.prototype.setComponent = function (component) {
    this.component_ = component;
};

openmultimedia.componentes.EmbeddableWidgetWrapper.prototype.adjustSize_ = function() {
    if ( this.document_ && this.element_ ) {
        var documentSize = goog.dom.getViewportSize();

        goog.style.setSize(this.document_.body, documentSize);
        goog.style.setSize(this.element_, documentSize);
    }
}

openmultimedia.componentes.EmbeddableWidgetWrapper.prototype.render = function () {
    if ( this.component_ && this.element_ ) {
        this.component_.render(this.element_);
    }
};
