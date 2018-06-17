import './operators';

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

declare var FB:any
declare global {
  interface Window { fbAsyncInit: any; }
}
@Component(
  {
    selector: 'speegar-app',
    template:   '<router-outlet></router-outlet>',


  })
export class AppComponent implements OnInit {
  constructor(private translate: TranslateService) {

    let userLang = localStorage.getItem('userLang');
    if (!userLang) {
      userLang = navigator.language;
    }

    if (userLang.startsWith('es') ) {
       translate.setDefaultLang('es');
    } else if (userLang.startsWith('fr') ) {
      translate.setDefaultLang('fr');
    } else {
      translate.setDefaultLang('en');
    }
  }


  ngOnInit(){

    window.fbAsyncInit = function() {
      FB.init({
        appId      : '963422573811438',
        xfbml      : true,
        version    : 'v2.11'
      });
      FB.AppEvents.logPageView();
    };

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.com/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  login(){
    FB.login(function(response) {
      if (response.status === 'connected') {
        // Logged into your app and Facebook.

      } else {

        // The person is not logged into this app or we are unable to tell.
      }
    });
  }
}
