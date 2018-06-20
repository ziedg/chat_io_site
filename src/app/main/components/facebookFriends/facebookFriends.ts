import 'rxjs/add/operator/map';

import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment';
import { User } from '../../../beans/user';
import { LoginService } from '../../../login/services/loginService';
import { AppSettings } from '../../../shared/conf/app-settings';
import * as pathUtils from '../../../utils/path.utils';

declare var jQuery: any;

@Component({
    moduleId: module.id,
    selector: 'facebook-friends',
    templateUrl: 'facebookFriends.html'
  })

export class FacebookFriends {

    public facebookProfiles: Array<User> = [];
    public popularProfiles: Array<User> = [];
    displayedNumberfacebookProfiles = 10;
    public user: User = new User();
    lastPopularProfileID;

    constructor(public translate: TranslateService,
        private http: Http,
        private router: Router,
        private loginService: LoginService,
        private changeDetector: ChangeDetectorRef) {
        loginService.redirect();
        this.user = loginService.user;
        //this.loadfacebookProfiles();  
        Array.prototype.push.apply(this.facebookProfiles, [
          {
            "notifications": [],
            "pictures": [],
            "publications": [
              "5b11e2fc70258c11d7d11119",
              "5b12f00270034b609979757f"
            ],
            "comments": [
              "5ae34dc2941d1a463b58dd16",
              "5b0dc9c60a78f023cd848f10",
              "5b128ac070034b6099790c78"
            ],
            "subscribers": [
              "5ae3a59bfb906b10c6414169",
              "5ae5f501d06c3202ad19fe57",
              "5ae36e45fb906b10c64140a2",
              "5ae36c59aef58c10af7fd4c5",
              "5ae5d266c1720d0271ef9078",
              "5b0c4b205af8bb3795afc404",
              "5aead60f4156db5675560153",
              "5b0559ff694194379a2b8bf8",
              "5ae354f3f3136446584c1418",
              "5b11bc4204f4cd383591a54b",
              "5ae35fa604568210bc4f45dc",
              "5b13e68051a8e06086c0e01e",
              "5ae34e67a1288f465e19547f",
              "5b11bbe176331a381f3c6460",
              "5b16833683a8064e577e1329",
              "5b0178c64aa57e4c3a8d1e67",
              "5b0955d3694194379a2e904e",
              "5b19ec276e3aed78e42a4ace",
              "5b15cb1c2fc3fd77320f9c42"
            ],
            "likers": [
              "5b19ec276e3aed78e42a4ace",
              "5ae3a59bfb906b10c6414169",
              "5b1d075c502a814e3cf67e64",
              "5b0c4b205af8bb3795afc404",
              "5b02c124f2cbcd4c496188ad",
              "5b0559ff694194379a2b8bf8",
              "5b11bbe176331a381f3c6460",
              "5b11eff1862d642dd6f49d75",
              "5ae34e67a1288f465e19547f",
              "5b11b61e04f4cd383591a540",
              "5b11bc4204f4cd383591a54b",
              "5b0178c64aa57e4c3a8d1e67",
              "5ae34966a1b5133bbd87fb96",
              "5ae8aab465ef2c2b4f0a5d0e",
              "5ae89804c770f31080b9bc1d",
              "5ae88b047cb3c410854c140d",
              "5ae8858fc770f31080b9bb78",
              "5ae872b00e6b49122f6d2fcf",
              "5ae603c59a39ae02a86dd81e",
              "5ae5f991c1720d0271ef9139",
              "5ae5f501d06c3202ad19fe57",
              "5ae36c59aef58c10af7fd4c5",
              "5ae5df993be0e80279d87616",
              "5ae5d3b7d06c3202ad19fdbb",
              "5ae5d266c1720d0271ef9078"
            ],
            "friends": [
              "10209274085363946",
              "2232653610083460",
              "2152924701419992",
              "1877695879196811",
              "621868458161875",
              "207577319975835"
            ],
            "ignoredProfiles": [
              "5ae36d6e406a6f10aa15937e",
              "5ae603c59a39ae02a86dd81e",
              "5ae5f991c1720d0271ef9139",
              "5ae5f991c1720d0271ef9139",
              "5ae606e09a39ae02a86dd836",
              "5ae65a190e6b49122f6d1eec",
              "5b041ef0f679654c440764df",
              "5ae3647b406a6f10aa159361",
              "5ae6662b7a7859124a5158ad",
              "5ae89804c770f31080b9bc1d",
              "5ae36b1c406a6f10aa159373",
              "5b027a16f679654c440764b3"
            ],
            "_id": "5ae34966a1b5133bbd87fb96",
            "facebookId": "771366359721549",
            "firstName": "Zied",
            "lastName": "Saidi",
            "email": "zied_121@live.fr",
            "nbSubscribers": 19,
            "nbSuivi": 74,
            "nbPublications": 3,
            "nbLikes": 11,
            "nbNotificationsNotSeen": 0,
            "isAdmin": 0,
            "gender": "male",
            "profilePicture": "https://integration.speegar.com/images/5ae37865406a6f10aa1593a4_2018-04-27T19-22-13975Z.jpeg",
            "profilePictureMin": "https://integration.speegar.com/images/5ae37865406a6f10aa1593a4_2018-04-27T19-22-13975Z.jpeg",
            "name": "Zied Saidi",
            "dateInscription": "2018-04-27",
            "isNewInscri": "false",
            "about": "",
            "socketId": "L80isf9waatLoWPhAAAQ"
          },
          {
            "notifications": [],
            "pictures": [],
            "publications": [
              "5b0a70d95af8bb3795ae2f57",
              "5b0e95f898240223e9e39c9f",
              "5b0eb37e98240223e9e3b671",
              "5b0ee99aaaa92a23db2f35d8",
              "5b104265aaa92a23db306b4e",
              "5b107fce0a78f023cd8713c2",
              "5b111ee1804d47762d6b764e",
              "5b132dbb4d166b608570a62a",
              "5b132dfc164f3f60932aa25f",
              "5b16e6fa5eda104e3aa5b0cf",
              "5b181605d4920a2b565e21e7",
              "5b1c22cf1af1484eb9844a29",
              "5b1dbce708919c4d64d93181"
            ],
            "comments": [
              "5b0eed720c420f23d25fec1b",
              "5b0f102998240223e9e403eb",
              "5b0f104498240223e9e403ed"
            ],
            "subscribers": [
              "5ae3a59bfb906b10c6414169",
              "5ae34966a1b5133bbd87fb96",
              "5ae34966a1b5133bbd87fb96",
              "5ae3647b406a6f10aa159361",
              "5ae354f3f3136446584c1418",
              "5ae36f36fb906b10c64140a5",
              "5ae3686dfb906b10c641408e",
              "5ae36c59aef58c10af7fd4c5",
              "5ae5df993be0e80279d87616",
              "5ae5d3b7d06c3202ad19fdbb",
              "5ae5f991c1720d0271ef9139",
              "5ae5fef6d06c3202ad19fe94",
              "5ae36e45fb906b10c64140a2",
              "5ae36b1c406a6f10aa159373",
              "5ae606e09a39ae02a86dd836",
              "5ae65954ce3776124545c5d9",
              "5aea470f5774510c16632e21",
              "5ae65a190e6b49122f6d1eec",
              "5ae872b00e6b49122f6d2fcf",
              "5ae88b047cb3c410854c140d",
              "5ae8e31120191547d8989c91",
              "5aea47455774510c16632e23",
              "5ae5fb8f9a39ae02a86dd7f1",
              "5aead60f4156db5675560153",
              "5ae614713be0e80279d87743",
              "5ae7a24d5108dd12346145d4",
              "5ae5d266c1720d0271ef9078",
              "5ae5f501d06c3202ad19fe57",
              "5ae5fbfb9a39ae02a86dd7f3",
              "5ae603c59a39ae02a86dd81e",
              "5ae35a8c941d1a463b58dd24",
              "5ae6662b7a7859124a5158ad",
              "5b04c36547e24a37ab287b96",
              "5ae62a233be0e80279d877d5",
              "5ae8858fc770f31080b9bb78",
              "5b041ef0f679654c440764df",
              "5b0559ff694194379a2b8bf8",
              "5b02c124f2cbcd4c496188ad",
              "5b11bc4204f4cd383591a54b",
              "5b0c4b205af8bb3795afc404",
              "5b027a16f679654c440764b3",
              "5b18350e33a1b8294b02fcb9",
              "5b1c223d0f5b144ec948daa6",
              "5b1c27c61af1484eb9845d29"
            ],
            "likers": [
              "5b1d075c502a814e3cf67e64",
              "5b1c0a0e6c4b7826e14f72f4",
              "5b19ec276e3aed78e42a4ace",
              "5b0c4b205af8bb3795afc404",
              "5b14003170034b60997a9a6d",
              "5b12dbd470034b6099796622",
              "5ae34966a1b5133bbd87fb96",
              "5b04c36547e24a37ab287b96",
              "5b1336dc70034b609979c1c0",
              "5b02c124f2cbcd4c496188ad",
              "5b12c294164f3f60932a37aa",
              "5b0d754e6fc02c3758976cee",
              "5ae34e67a1288f465e19547f",
              "5b11eff1862d642dd6f49d75",
              "5b041ef0f679654c440764df",
              "5b0178c64aa57e4c3a8d1e67"
            ],
            "friends": [
              "10209274085363946",
              "2232653610083460",
              "2152924701419992",
              "771366359721549",
              "1877695879196811"
            ],
            "ignoredProfiles": [
              "5ae65a190e6b49122f6d1eec",
              "5ae872b00e6b49122f6d2fcf",
              "5ae88b047cb3c410854c140d",
              "5ae8e31120191547d8989c91",
              "5aea47455774510c16632e23",
              "5ae5fb8f9a39ae02a86dd7f1",
              "5aead60f4156db5675560153",
              "5ae614713be0e80279d87743",
              "5ae7a24d5108dd12346145d4",
              "5ae35fa604568210bc4f45dc",
              "5ae36d6e406a6f10aa15937e",
              "5b061b765af8bb3795aad5fd",
              "5ae89804c770f31080b9bc1d"
            ],
            "_id": "5b0178c64aa57e4c3a8d1e67",
            "facebookId": "207577319975835",
            "firstName": "Lassad",
            "lastName": "Kouraichi",
            "nbSubscribers": 42,
            "nbSuivi": 44,
            "nbPublications": 22,
            "nbLikes": 39,
            "nbNotificationsNotSeen": 5,
            "isAdmin": 0,
            "gender": "male",
            "profilePicture": "https://integration.speegar.com/images/207577319975835.jpeg",
            "profilePictureMin": "https://integration.speegar.com/images/207577319975835_min.jpeg",
            "name": "Lassad Kouraichi",
            "dateInscription": "2018-05-20",
            "isNewInscri": "false",
            "socketId": "1LRIyZgg9Vzx-Fg8AADb"
          },
          {
            "notifications": [],
            "pictures": [],
            "publications": [],
            "comments": [],
            "subscribers": [
              "5b02c124f2cbcd4c496188ad",
              "5b041ef0f679654c440764df",
              "5b11bc4204f4cd383591a54b",
              "5aead60f4156db5675560153",
              "5ae3a59bfb906b10c6414169",
              "5b0c4b205af8bb3795afc404",
              "5b11b61e04f4cd383591a540"
            ],
            "likers": [],
            "friends": [],
            "ignoredProfiles": [],
            "_id": "5b15cb1c2fc3fd77320f9c42",
            "facebookId": "2152924701419992",
            "firstName": "Hammemi",
            "lastName": "Sihem",
            "email": "sihem-hamemi@live.fr",
            "nbSubscribers": 7,
            "nbSuivi": 3,
            "nbPublications": 0,
            "nbLikes": 0,
            "nbNotificationsNotSeen": 3,
            "isAdmin": 0,
            "gender": "female",
            "profilePicture": "https://integration.speegar.com/images/2152924701419992.jpeg",
            "profilePictureMin": "https://integration.speegar.com/images/2152924701419992_min.jpeg",
            "name": "Hammemi Sihem",
            "dateInscription": "2018-06-04",
            "isNewInscri": "false"
          },
          {
            "notifications": [],
            "pictures": [],
            "publications": [
              "5b1e660eafb5145f26e5ed8f",
              "5b1e6674afb5145f26e5ed91"
            ],
            "comments": [
              "5b1dbec608919c4d64d93189"
            ],
            "subscribers": [
              "5ae3a59bfb906b10c6414169",
              "5b0c4b205af8bb3795afc404",
              "5b11b61e04f4cd383591a540",
              "5ae5d266c1720d0271ef9078",
              "5ae34e67a1288f465e19547f",
              "5ae3647b406a6f10aa159361",
              "5ae35a8c941d1a463b58dd24",
              "5ae36e45fb906b10c64140a2",
              "5ae65954ce3776124545c5d9",
              "5ae36f36fb906b10c64140a5",
              "5ae8858fc770f31080b9bb78",
              "5ae5f991c1720d0271ef9139",
              "5aea470f5774510c16632e21",
              "5ae5fb8f9a39ae02a86dd7f1",
              "5b0a744d9180cd37b0129e40",
              "5ae606e09a39ae02a86dd836",
              "5b0a0e669180cd37b0124400",
              "5ae62a233be0e80279d877d5",
              "5b0d754e6fc02c3758976cee",
              "5ae872b00e6b49122f6d2fcf",
              "5ae8e31120191547d8989c91",
              "5b04c36547e24a37ab287b96",
              "5b11bbe176331a381f3c6460",
              "5b0a71235af8bb3795ae2f59",
              "5b11d17fbe2bd1383be4b0f1",
              "5b13e68051a8e06086c0e01e",
              "5b1d075c502a814e3cf67e64",
              "5b160058deaab74e49f2d0c4",
              "5b1b884008ee834bf634bd9d",
              "5b1c4094279d5a6a6c9119a6",
              "5b11bc4204f4cd383591a54b",
              "5ae354f3f3136446584c1418",
              "5ae36b1c406a6f10aa159373",
              "5ae5d3b7d06c3202ad19fdbb",
              "5ae5fbfb9a39ae02a86dd7f3",
              "5b0e032d0a78f023cd84c18c",
              "5ae5f501d06c3202ad19fe57",
              "5ae5fef6d06c3202ad19fe94",
              "5ae603c59a39ae02a86dd81e",
              "5ae65a190e6b49122f6d1eec",
              "5ae34966a1b5133bbd87fb96",
              "5ae36c59aef58c10af7fd4c5",
              "5ae5df993be0e80279d87616",
              "5ae3686dfb906b10c641408e",
              "5ae614713be0e80279d87743",
              "5ae7a24d5108dd12346145d4",
              "5ae8aab465ef2c2b4f0a5d0e",
              "5b11a836c50d4a1561ea8d9f",
              "5b12c294164f3f60932a37aa",
              "5b15caf92a9bc577270321bc",
              "5b18571c1d4d8a29596daca8",
              "5b1c0a4a6c4b7826e14f72f6",
              "5b1e5602afb5145f26e5c56f",
              "5b028d9d0001f74c355ecea5",
              "5b11eff1862d642dd6f49d75",
              "5b13ff0270034b60997a9a69",
              "5ae35fa604568210bc4f45dc",
              "5ae36d6e406a6f10aa15937e",
              "5ae6662b7a7859124a5158ad",
              "5ae89804c770f31080b9bc1d",
              "5ae88b047cb3c410854c140d",
              "5b102d5d0a78f023cd86c4f8",
              "5b11f989eb06bc37f104e596",
              "5b14003170034b60997a9a6d",
              "5b027a16f679654c440764b3",
              "5b18350e33a1b8294b02fcb9",
              "5b0955d3694194379a2e904e",
              "5b1336dc70034b609979c1c0",
              "5b1c0a0e6c4b7826e14f72f4",
              "5b15cb1c2fc3fd77320f9c42",
              "5b19ec276e3aed78e42a4ace",
              "5b1c27c61af1484eb9845d29",
              "5b1dd94c8b382d3b85be5f84",
              "5b1e56fdafb5145f26e5d95d",
              "5aea47455774510c16632e23",
              "5b0aa74f47e24a37ab2cfda7",
              "5b1b8b8b65a205793cd8917c",
              "5aead60f4156db5675560153",
              "5b041ef0f679654c440764df",
              "5b1c223d0f5b144ec948daa6",
              "5b0559ff694194379a2b8bf8",
              "5b1ec9e622cf3704edee1fb1",
              "5b0da67598240223e9e2c333",
              "5b061b765af8bb3795aad5fd",
              "5b0178c64aa57e4c3a8d1e67",
              "5b1ec77722cf3704edee1fa9",
              "5b02c124f2cbcd4c496188ad",
              "5b1ecbf522cf3704edee1fb5",
              "5b12dbd470034b6099796622"
            ],
            "likers": [
              "5ae34966a1b5133bbd87fb96",
              "5b16833683a8064e577e1329"
            ],
            "friends": [
              "10209274085363946",
              "2232653610083460",
              "2152924701419992",
              "771366359721549",
              "621868458161875",
              "207577319975835"
            ],
            "ignoredProfiles": [],
            "_id": "5b16833683a8064e577e1329",
            "facebookId": "1877695879196811",
            "firstName": "Khouloud",
            "lastName": "Ltaief",
            "email": "khalil2014r@hotmail.com",
            "nbSubscribers": 89,
            "nbSuivi": 3,
            "nbPublications": 2,
            "nbLikes": 2,
            "nbNotificationsNotSeen": 2,
            "isAdmin": 0,
            "gender": "female",
            "profilePicture": "https://integration.speegar.com/images/1877695879196811.jpeg",
            "profilePictureMin": "https://integration.speegar.com/images/1877695879196811_min.jpeg",
            "name": "Khouloud Ltaief",
            "dateInscription": "2018-06-05",
            "isNewInscri": "false",
            "socketId": "jxfS8zgdbXWalMHAAACD"
          }
        ]);

        }

  
    loadfacebookProfiles() {

        var url: string = environment.SERVER_URL + pathUtils.GET_FACEBOOK_FRIENDS;

        this.http.get(url,
            AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
              response => {

                Array.prototype.push.apply(this.facebookProfiles, response.message);

            },
            err => {
            },
            () => {
              this.changeDetector.markForCheck();
            }
          );
    } 

    loadPopularProfiles(Id_Profile?: string) {
      var url: string = environment.SERVER_URL + pathUtils.GET_POPULAR_PROFILES + '/';
      if (Id_Profile) { url += Id_Profile }
      this.http.get(url,
        AppSettings.OPTIONS)
        .map((res: Response) => res.json())
        .subscribe(
          response => {
          
            Array.prototype.push.apply(this.popularProfiles, response.profiles);

            response.profiles = response.profiles.filter(el => this.facebookProfiles.indexOf(el) === -1);
            response.profiles = response.profiles.map(el => {  el.ispop = true ; return el;} );
            Array.prototype.push.apply(this.facebookProfiles, response.profiles);

            //changes
            if (response.profiles && response.profiles.length) {
              this.lastPopularProfileID = response.profiles[response.profiles.length - 1]._id;
            }
            //
          },
          err => {
          },
          () => {
            this.changeDetector.markForCheck();
          }
        );
    }

    subscribe(user: User) {
        let body = JSON.stringify({
          profileId: user._id
        });
    
        this.http.post(
          environment.SERVER_URL + pathUtils.SUBSCRIBE,
          body,
          AppSettings.OPTIONS
        )
          .map((res: Response) => res.json())
          .subscribe(
            response => {
              if (response.status == 0) {
                this.facebookProfiles.splice(this.facebookProfiles.indexOf(user), 1);
              }
            },
            err => {
            },
            () => {
              this.changeDetector.markForCheck();
            }
          );
    
    }

    unsubscribe(user: User) {
        let body = JSON.stringify({
          profileId: user._id
        });
    
        this.http.post(
          environment.SERVER_URL + pathUtils.UNSUBSCRIBE,
          body,
          AppSettings.OPTIONS)
          .map((res: Response) => res.json())
          .subscribe(
            response => {
              if (response.status == 0) {
                user.isFollowed = false;
                user.nbSuivi--;
              }
            },
            err => {
            },
            () => {
              this.changeDetector.markForCheck();
            }
          );
    }

    ignore(user: User) {
        let body = JSON.stringify({
          profileId: user._id
        });

        this.http.post(
          environment.SERVER_URL + pathUtils.IGNORE,
          body,
          AppSettings.OPTIONS
        )
          .map((res: Response) => res.json())
          .subscribe(
            response => {
              if (response.status == 0) {
                this.facebookProfiles.splice(this.facebookProfiles.indexOf(user), 1);
              }
            },
            err => {
            },
            () => {
              this.changeDetector.markForCheck();
            }
          );
    
    
    }

    onScrollDown() {
      if (this.popularProfiles.length < 6) {
        this.loadPopularProfiles(this.lastPopularProfileID);
      }
    }

    sideScroll(direction,speed,distance,step){
      var fbContainer = jQuery(".fb-suggestions-container");
      //var scrollAmount = 0;
     /* var slideTimer = setInterval(function(){
          if(direction == 'left'){
              fbContainer.scrollLeft -= step;
          } else {
              fbContainer.scrollLeft += step;
          }
          scrollAmount += step;
          if(scrollAmount >= distance){
              window.clearInterval(slideTimer);
          }
      }, speed);*/
      if(direction == 'left'){
        fbContainer.animate( { scrollLeft: '-=460' }, 1000);
      }else{
        fbContainer.animate( { scrollLeft: '+=460' }, 1000);
      }
    }

}