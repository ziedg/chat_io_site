import { Inject, Injectable } from '@angular/core';
import { DOCUMENT, Title } from '@angular/platform-browser';

@Injectable()

export class SeoService {
 /**
  * Angular 2 Title Service
  */
  private titleService: Title;
 /**
  * <head> Element of the HTML document
  */
  private headElement: HTMLElement;
 /**
  * <head> Element of the HTML document
  */
  private metaDescription: HTMLElement;
 /**
  * <head> Element of the HTML document
  */
  private robots: HTMLElement;

 /**
  * Inject the Angular 2 Title Service
  * @param titleService
  */
  constructor(titleService: Title, @Inject(DOCUMENT) private document){
    this.titleService = titleService;

   /**
    * get the <head> Element
    * @type {any}
    */
    this.headElement = this.document.getElementsByTagName('head');
    this.metaDescription = this.getOrCreateMetaElement('description');
    this.robots = this.getOrCreateMetaElement('robots');
  }

  public getTitle(): string {
    return this.titleService.getTitle();
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  public getMetaDescription(): string {
    return this.metaDescription.getAttribute('content');
  }

  public setMetaDescription(description: string) {
    this.metaDescription.setAttribute('content', description);
  }

  public getMetaRobots(): string {
    return this.robots.getAttribute('content');
  }

  public setMetaRobots(robots: string) {
    this.robots.setAttribute('content', robots);
  }

   /**
    * get the HTML Element when it is in the markup, or create it.
    * @param name
    * @returns {HTMLElement}
    */
    private getOrCreateMetaElement(name: string): HTMLElement {
      let el: HTMLElement;
      el = this.document.getElementsByTagName('meta[name=' + name + ']');
      if (el === null) {
        el = this.document.createElement('meta');
        el.setAttribute('name', name);
        this.headElement.appendChild(el);
      }
      return el;
    }

}
