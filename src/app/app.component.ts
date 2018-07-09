import './operators';

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Meta } from '@angular/platform-browser';

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
  meta: Meta;

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

    // get os info ---------------
    let userAgent = navigator.userAgent || navigator.vendor; //|| window.opera;
    let osRegExp: RegExp = /iPad|iPhone|iPod|android|windows phone/i;
    if(osRegExp.test(userAgent)) {
      console.log("-------------------> mobile")
      this.meta.addTag({
        name: "viewport",
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      });
    }
    //----------------------------
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
