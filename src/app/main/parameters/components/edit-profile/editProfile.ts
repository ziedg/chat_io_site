import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../../environments/environment';
import { User } from '../../../../beans/user';
import { AppSettings } from '../../../../shared/conf/app-settings';
import { LoginService } from '../../../../login/services/loginService';
import * as pathUtils from '../../../../utils/path.utils';


declare var jQuery:any;
declare var swal:any;


@Component({
  moduleId: module.id,
  selector: 'edit-profile',
  templateUrl: 'editProfile.html',
  changeDetection: ChangeDetectionStrategy.OnPush

})


export class EditProfile {
  form;
  public user:User = new User();
  public errFistName = "";
  public errLastName = "";
  public errLinkFB = "";
  public errLinkYoutube = "";
  public errLinkTwitter = "";
  errorMessage:string = null;

  constructor(public translate:TranslateService,
              private route:ActivatedRoute,
              private http:Http,
              private changeDetector:ChangeDetectorRef,
              private router:Router,
              private loginService:LoginService) {

    this.loginService.redirect();

    this.form = new FormGroup({
      lastName: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      userDiscrip: new FormControl(),
      genre: new FormControl(),
      linkFB: new FormControl(),
      linkTwitter: new FormControl(),
      linkYoutube: new FormControl()
    });
  }

  ngOnInit() {
    this.loginService.actualize();
    this.user = this.loginService.getUser();
    this.changeDetector.markForCheck();

  }

  getFirstName():string {
    if (this.form.value.firstName) {
      return this.form.value.firstName;
    }
    else {
      return jQuery("#firstName").val();
    }
  }

  checkFirstName():boolean {
    if (this.getFirstName() && this.getFirstName().length > 1) {
      this.errFistName = "";
      return true;
    }
    else {
      this.errFistName = this.translateCode("SP_FV_ER_FIRST_NAME_SBN_EMPTY");
      return false;
    }
  }

  getLastName():string {
    if (this.form.value.lastName) {
      return this.form.value.lastName;
    }
    else {
      return jQuery("#lastName").val();
    }
  }

  getDisc():string {
    return jQuery("#userDiscrip").val();
  }

  getGerne():string {
    return jQuery("#genre").val();
  }

  getFBLink():string {
    return jQuery("#linkFB").val();
  }

  getYoutubeLink():string {
    return jQuery("#linkYoutube").val();
  }

  getTwitterLink():string {
    return jQuery("#linkTwitter").val();
  }

  checkLastName():boolean {
    if (this.getLastName() && this.getLastName().length > 1) {
      this.errLastName = "";
      return true;
    }
    else {
      this.errLastName = this.translateCode("SP_FV_ER_LAST_NAME_SBN_EMPTY");
      return false;
    }
  }

  checkYoutubeLink() {
    if (this.getYoutubeLink() && ( this.getYoutubeLink().indexOf("https://www.youtube.com/") == 0 || this.getYoutubeLink().indexOf("https://youtube.com/") == 0 || this.getYoutubeLink().indexOf("http://www.youtube.com/") == 0 || this.getYoutubeLink().indexOf("http://youtube.com/") == 0)) {
      this.errLinkYoutube = "";
      return true;
    }
    else if (this.getYoutubeLink().length == 0) {
      this.errLinkYoutube = "";
      return true;
    }
    else {
      this.errLinkYoutube = this.translateCode("SP_FV_ER_YOUTUBE_LINK_NOT_VALID");
      return false;
    }
  }

  checkTwitterLink() {
    if (this.getTwitterLink() && ( this.getTwitterLink().indexOf("https://www.twitter.com/") == 0 || this.getTwitterLink().indexOf("https://twitter.com/") == 0 || this.getTwitterLink().indexOf("http://www.twitter.com/") == 0 || this.getTwitterLink().indexOf("http://twitter.com/") == 0)) {
      this.errLinkTwitter = "";
      return true;
    }
    else if (this.getTwitterLink().length == 0) {
      this.errLinkTwitter = "";
      return true;
    }
    else {
      this.errLinkTwitter = this.translateCode("SP_FV_ER_FB_TWITTER_NOT_VALID");
      return false;
    }
  }

  checkFBLink() {
    if (this.getFBLink() && ( this.getFBLink().indexOf("https://www.facebook.com/") == 0 || this.getFBLink().indexOf("https://facebook.com/") == 0 || this.getFBLink().indexOf("http://www.facebook.com/") == 0 || this.getFBLink().indexOf("http://facebook.com/") == 0)) {
      this.errLinkFB = "";
      return true;
    }
    else if (this.getFBLink().length == 0) {
      this.errLinkFB = "";
      return true;
    }
    else {
      this.errLinkFB = this.translateCode("SP_FV_ER_FB_LINK_NOT_VALID");
      return false;
    }
  }

  saveData() {
    this.errorMessage=null;
    if (this.checkFirstName() && this.checkLastName() /*&& this.checkTwitterLink() && this.checkYoutubeLink() && this.checkFBLink()*/) {

      let body = JSON.stringify({
        profileId: this.user._id,
        firstName: this.getFirstName(),
        lastName: this.getLastName(),
        facebookLink: this.getFBLink(),
        twitterLink: this.getTwitterLink(),
        youtubeLink: this.getYoutubeLink(),
        about: this.getDisc()
      });
      this.http.post(environment.SERVER_URL + pathUtils.UPDATE_PROFILE,
        body,
        AppSettings.OPTIONS)
        .map((res:Response) => res.json())
        .subscribe(
          response => {

          if (response.status == 0) {
            this.loginService.updateUser(response.profile);
            this.loginService.actualize();
            this.user = this.loginService.getUser();
            this.changeDetector.markForCheck();

            swal({
              title: this.translateCode("edit_profile_popup_notification_update_title"),
              text: this.translateCode("edit_profile_popup_notification_update_text"),
              type: "success",
              timer: 2000,
              showConfirmButton: false
            }).then(function () {
            }, function (dismiss) {
            });
          } else {
            this.errorMessage = response.error;
          }
        },
          err => {
            this.errorMessage = "SP_ER_TECHNICAL_ERROR";
        },
        () => {
        }
      );
    }
  }


  translateCode(code) {
    let message;
    this.translate.get(code).subscribe((resTranslate:string) => {
      message = resTranslate;
    });
    return message;
  }

}



