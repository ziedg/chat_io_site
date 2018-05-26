import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TopBlagueursAndDecov } from '../../topBlagueursAndDecov/topBlagueursAndDecov';
import 'rxjs/add/operator/map';

import { Publication } from '../../publication/publication';
import { Comment } from '../../comment/comment';

/* conf */
import { AppSettings } from '../../conf/app-settings';

/* services */
import { LoginService } from '../../service/loginService';
import { LinkView } from "../../service/linkView";
import { LinkPreview } from "../../service/linkPreview";
import {TranslateService} from '@ngx-translate/core';


/* user  */
import { User } from '../../beans/user';

/* beans */
import { PublicationBean } from '../../beans/publication-bean';
import { NotFound } from "../notFound/not-found";
import { Title } from "@angular/platform-browser";
import { LinkBean } from '../../beans/linkBean';
import {environment} from "../../../environments/environment";

/** Utils */
import * as pathUtils from '../../utils/path.utils';


declare var $:any;
declare var jQuery:any;
declare var swal:any;
declare var BlobBuilder:any;
declare var FB:any;
declare var auth:any;
declare const gapi:any;

@Component({
  moduleId: module.id,
  selector: 'profile',
  templateUrl: 'profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class Profile {
  private isNotFound:boolean = false;

  uploadedProfilePicture:File;


  isLock:boolean = false;
  finPosts:boolean = false;
  public publicationBeanList:Array<PublicationBean> = [];
  public user:User = new User();
  public userDisplayed:User = new User();


  selectedMenuElement = 0;


  showLoading = false;
  lastPostId:string = "";

  lastRouterProfileId;
  editModal = false;

  publishBox = false;
  firstListSub:Array<User> = [];
  listAllSub:Array<User> = [];
  showMoreSub = false;
  lastSubscribeId:string = "";
  stopGiveMeMoreSub:boolean = false;
  editDescriptionEnable = false;
  linkLoading = false;
  isEmpty = true;
  profilePictLoad:boolean = false;
  loadMore =true;


  constructor(public translate:TranslateService,
              private linkView:LinkView,
              private linkPreview:LinkPreview,
              private title:Title,
              private route:ActivatedRoute,
              private http:Http,
              private router:Router,
              private loginService:LoginService,
              private changeDetector:ChangeDetectorRef) {

    this.loginService.redirect();


    this.lastPostId = "";
    this.publicationBeanList = [];

    this.user = this.loginService.user;

    this.router.events.subscribe(route => {
      this.changeDetector.markForCheck();
      if (this.route.snapshot.params['id'] != this.lastRouterProfileId) {
        this.lastRouterProfileId = this.route.snapshot.params['id'];
        this.getProfile(this.route.snapshot.params['id']);
        this.publicationBeanList = [];

      }
      window.scrollTo(0, 0);
    });

  }

  getProfile(userId:string) {
    if (this.user) {
      this.http.get(
        environment.SERVER_URL + pathUtils.GET_PROFILE + userId,
        AppSettings.OPTIONS)
        .map((res:Response) => res.json())
        .subscribe(
          response => {

          if (response.status == "0") {

            this.userDisplayed = response.user;
            this.title.setTitle(this.userDisplayed.firstName + " " + this.userDisplayed.lastName);
            this.loadFirstPosts();
          } else {
            this.isNotFound = true;
          }

        },
          err => {
          this.isNotFound = true;
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );
    }

  }


  goFB() {
    if (this.userDisplayed.facebookLink)
      location.href = this.userDisplayed.facebookLink;
  }

  goTW() {
    if (this.userDisplayed.twitterLink)
      location.href = this.userDisplayed.twitterLink;
  }

  goYT() {
    if (this.userDisplayed.youtubeLink)
      location.href = this.userDisplayed.youtubeLink;
  }


  subscribe(userDisplayed:User) {
    let body = JSON.stringify({
      profileId: userDisplayed._id
    });

    this.http.post(
      environment.SERVER_URL + pathUtils.SUBSCRIBE,
      body,
      AppSettings.OPTIONS
    )
      .map((res:Response) => res.json())
      .subscribe(
        response => {
        if (response.status == 0) {
          userDisplayed.isFollowed = true;
          userDisplayed.nbSuivi++;

        }
      },
        err => {
      },
      () => {
        this.changeDetector.markForCheck();
      }
    );
  }

  unsubscribe(userDisplayed:User) {
    let body = JSON.stringify({
      profileId: userDisplayed._id
    });

    this.http.post(
      environment.SERVER_URL + pathUtils.UNSUBSCRIBE,
      body,
      AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {
        if (response.status == 0) {
          userDisplayed.isFollowed = false;
          userDisplayed.nbSuivi--;
        }
      },
        err => {
      },
      () => {
        this.changeDetector.markForCheck();
      }
    );
  }


  putIntoList(response) {
    if (!response.length || response.length == 0) {
      this.showLoading = false;
      this.isLock = false;
      return;
    }
    let element;
    for (var i = 0; i < response.length; i++) {
      element = response[i];
      element.displayed = true;

      if (response[i].isShared == "true") {
        element.isShared = true;
      }
      else {
        element.isShared = false;
      }

      if (response[i].isLiked == "true")
        element.isLiked = true;
      else
        element.isLiked = false;

      if (response[i].isDisliked == "true")
        element.isDisliked = true;
      else
        element.isDisliked = false;

      for (var j = 0; j < response[i].comments.length; j++) {
        if (response[i].comments[j].isLiked == "true")
          element.comments[j].isLiked = true;
        else
          element.comments[j].isLiked = false;

        if (response[i].comments[j].isDisliked == "true")
          element.comments[j].isDisliked = true;
        else
          element.comments[j].isDisliked = false;

        if (j == response[i].comments.length) {
          this.publicationBeanList.push(element);

          if (i == response.length - 1) {
            this.showLoading = false;
            this.isLock = false;
            this.lastPostId = response[i]._id;
          }
        }
      }

      this.publicationBeanList.push(element);
      if (i == response.length - 1) {
        this.showLoading = false;
        this.isLock = false;
        this.lastPostId = response[i]._id;
      }

    }
  }

  loadFirstPosts() {
    this.isLock = true;
    this.showLoading = true;
    let urlAndPara = environment.SERVER_URL +
      pathUtils.GET_PROFILE_PUBLICATIONS
        .replace("PROFILE_ID", this.userDisplayed._id);
    this.http.get(
      urlAndPara, AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {
        this.publicationBeanList = [];
        this.putIntoList(response);
        if(response.length === 0){this.loadMore=false}
        this.changeDetector.markForCheck();
        if(response.length === 0){this.loadMore=false}
      },
        err => {
        setTimeout(() => {
          this.showLoading = false;
          this.isLock = true;
        }, 3000);
      },
      () => {
      }
    );
  }

  loadMorePosts() {
    this.isLock = true;
    this.showLoading = true;
    let urlAndPara = environment.SERVER_URL
      + pathUtils.GET_PROFILE_PUBLICATIONS
        .replace("PROFILE_ID", this.userDisplayed._id)
      + this.lastPostId;
    this.http.get(
      urlAndPara, AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {
        this.putIntoList(response);
        if(response.length === 0){this.loadMore=false}
        this.changeDetector.markForCheck();
        if(response.length === 0){this.loadMore=false}
      },
        err => {
        this.isLock = false;
        this.showLoading = false;
      },
      () => {
      }
    );
  }

  onScrollDown() {
    if ((((this.lastPostId == "null")
      || (this.isLock)) || !$(window).scrollTop())) {
      return;
    }
    else {
      if(this.loadMore){this.loadMorePosts()}
      return 1;
    }
  }


  openModal() {

    jQuery(".modal-edit-profile").fadeIn(500);
  }

  closeModal() {
    jQuery(".modal-edit-profile").fadeOut(300);
  }

  openModalOtherProfile() {

    jQuery(".modal-other-profile-options").fadeIn(500);
  }

  closeModalOtherProfile() {
    jQuery(".modal-other-profile-options").fadeOut(300);
  }

  openModalFriends() {
    jQuery(".modal-friends").fadeIn(500);
  }

  closeModalFriends() {
    jQuery(".modal-friends").fadeOut(300);
  }

  ngOnInit() {
    jQuery(document).click(function (e) {
      if (jQuery(e.target).closest(".white-box-edit").length === 0 && jQuery(e.target).closest(".profile-edit").length === 0) {
        jQuery(".modal-edit-profile").fadeOut(300);
      }
    });

        jQuery(document).click(function (e) {
      if (jQuery(e.target).closest(".white-box-edit").length === 0 && jQuery(e.target).closest(".profile-edit").length === 0) {
        jQuery(".modal-other-profile-options").fadeOut(300);
      }
    });

    jQuery(document).click(function (e) {

      if (jQuery(e.target).closest(".select-menu").length === 0 && jQuery(e.target).closest(".dropdown").length === 0) {
        jQuery(".select-menu").hide();
      }
    });
  }

  enableSelectMenu() {
    jQuery(".select-menu").toggle();
  }

  changeSelectMenu(choice) {
    this.selectedMenuElement = choice;
  }

//change Youtube Input
  changeYoutubeInput() {
    jQuery(".yt-in-url").toggle();
  }

  addPhoto() {
    jQuery(("#file-image")).click();
  }

  addPhotoGIF() {
    jQuery(("#file-image-gif")).click();
  }

  changePhoto() {
    jQuery(("#file-profile")).click();
  }

  showPublishBox() {
    this.publishBox = true;
  }

  editDescription() {
    this.editDescriptionEnable = true;
  }

  saveDescriptionWithEnter(e) {
    e.preventDefault();
    this.saveDescription();
  }

  saveDescription() {
    var description = jQuery("#descEdit").val();
    this.userDisplayed.about = description;
    this.user.about = description;
    this.loginService.updateUser(this.user);
    let body = JSON.stringify({
      about: description
    });
    this.http.post(
      environment.SERVER_URL
      + pathUtils.UPDATE_PROFILE_DESCRIPTION,
      body,
      AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {

        this.editDescriptionEnable = false;
      },
        err => {
      },
      () => {
        this.changeDetector.markForCheck();
      }
    );
  }

  updateProfilePicture($event) {
    var inputValue = $event.target;

    if (inputValue != null && null != inputValue.files[0]) {
      this.uploadedProfilePicture = inputValue.files[0];
      previewProfilePicture(this.uploadedProfilePicture);
    }
    else {
      this.uploadedProfilePicture = null;
    }
  }

  changePhotoUpload() {
    if (!this.uploadedProfilePicture) {
      return;
    }

    this.changeDetector.markForCheck();
    var data = new FormData();
    data.append('profilePicture', this.uploadedProfilePicture);
    this.profilePictLoad = true;
    this.http.post(
      environment.SERVER_URL + pathUtils.UPDATE_PROFILE_PICTURE,
      data,
      AppSettings.OPTIONS_POST)
      .map((res:Response) => res.json())
      .subscribe(
        response => {

        if (response.status == "0") {




          if (this.loginService.isWasConnectedWithFacebook){
            let fuser = this.loginService.getFacebookUser();
            if( fuser && fuser.profilePicture)
            { fuser.profilePicture=response.profile.profilePicture
             localStorage.setItem('facebookUser',JSON.stringify(fuser));
            }
          }
          let user = this.loginService.getUser();
          user.profilePicture=response.profile.profilePicture
          localStorage.setItem('user', JSON.stringify(response.profile));
          this.loginService.actualize();
          this.changePhotoCancel();

          this.uploadedProfilePicture = null;
          jQuery("#file-profile").val("");
          this.profilePictLoad = false;
          jQuery(".profile-photo").css('background-image', 'url(' +response.profile.profilePicture || ""+')');
          this.profilePictLoad = false;
          swal({
            title: this.translateCode("profile_update_picture_popup_notification_title"),
            text: this.translateCode("profile_update_picture_popup_notification_text"),
            type: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(function () {
          }, function (dismiss) {
          });
        }
        else {
          this.profilePictLoad = false;
          this.changePhotoCancel();
        }
      },
        err => {
        this.profilePictLoad = false;
      },
      () => {
        this.changeDetector.markForCheck();
      }
    );
  }

  changePhotoCancel() {
    this.uploadedProfilePicture = null;
    jQuery("#file-profile").val("");
    jQuery(".profile-photo").css('background-image', 'url(' + this.userDisplayed.profilePicture + ')');
  }



  translateCode(code) {
    let message;
    this.translate.get(code).subscribe((resTranslate:string) => {
      message = resTranslate;
    });
    return message;
  }

}

function previewFile(uploadedFile) {
  var preview = jQuery('#preview-image');
  var file = uploadedFile;
  var reader = new FileReader();

  reader.addEventListener("load", function () {
    //preview.att.src = reader.result;
    jQuery("#preview-image").attr('src', reader.result);
    jQuery(".file-input-holder").fadeIn(500);
    jQuery("#preview-image").fadeIn(500);

  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

function previewProfilePicture(uploadedFile) {
  var preview = jQuery('.profile-photo');
  var file = uploadedFile;
  var reader = new FileReader();

  reader.addEventListener("load", function () {
    jQuery(preview).css('background-image', 'url(' + reader.result + ')');

  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}
