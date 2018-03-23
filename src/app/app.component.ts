import {Component, OnInit} from '@angular/core';
import './operators';
import {TranslateService} from 'ng2-translate';

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

  constructor(translate: TranslateService) {
    translate.setDefaultLang('fr');
    translate.use('fr');
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
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  login(){
    FB.login(function(response) {
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
        console.log("login")
      } else {
        console.log("not")
        // The person is not logged into this app or we are unable to tell.
      }
    });
  }
}
