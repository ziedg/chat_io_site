"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var dom_adapter_1 = require('@angular/platform-browser/src/dom/dom_adapter');
var SeoService = (function () {
    /**
     * Inject the Angular 2 Title Service
     * @param titleService
     */
    function SeoService(titleService) {
        this.titleService = titleService;
        this.DOM = dom_adapter_1.getDOM();
        /**
         * get the <head> Element
         * @type {any}
         */
        this.headElement = this.DOM.query('head');
        this.metaDescription = this.getOrCreateMetaElement('description');
        this.robots = this.getOrCreateMetaElement('robots');
    }
    SeoService.prototype.getTitle = function () {
        return this.titleService.getTitle();
    };
    SeoService.prototype.setTitle = function (newTitle) {
        this.titleService.setTitle(newTitle);
    };
    SeoService.prototype.getMetaDescription = function () {
        return this.metaDescription.getAttribute('content');
    };
    SeoService.prototype.setMetaDescription = function (description) {
        this.metaDescription.setAttribute('content', description);
    };
    SeoService.prototype.getMetaRobots = function () {
        return this.robots.getAttribute('content');
    };
    SeoService.prototype.setMetaRobots = function (robots) {
        this.robots.setAttribute('content', robots);
    };
    /**
     * get the HTML Element when it is in the markup, or create it.
     * @param name
     * @returns {HTMLElement}
     */
    SeoService.prototype.getOrCreateMetaElement = function (name) {
        var el;
        el = this.DOM.query('meta[name=' + name + ']');
        if (el === null) {
            el = this.DOM.createElement('meta');
            el.setAttribute('name', name);
            this.headElement.appendChild(el);
        }
        return el;
    };
    SeoService = __decorate([
        core_1.Injectable()
    ], SeoService);
    return SeoService;
}());
exports.SeoService = SeoService;
