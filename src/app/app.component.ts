import {Component} from '@angular/core';
import './operators';
import {TranslateService} from 'ng2-translate';

@Component(
  {
    selector: 'speegar-app',
    template: '<router-outlet></router-outlet>',

  })
export class AppComponent {

  constructor(translate: TranslateService) {
    translate.setDefaultLang('fr');
    translate.use('fr');
  }
}
