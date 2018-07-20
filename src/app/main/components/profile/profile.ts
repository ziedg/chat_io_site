import 'rxjs/add/operator/map';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment';
import { PublicationBean } from '../../../beans/publication-bean';
import { User } from '../../../beans/user';
import { LoginService } from '../../../login/services/loginService';
import { AppSettings } from '../../../shared/conf/app-settings';
import * as pathUtils from '../../../utils/path.utils';
import { LinkPreview } from '../../services/linkPreview';
import { LinkView } from '../../services/linkView';
import { PublicationTextService } from '../../services/publicationText.service';
import { ChatService } from '../../../messanging/chat.service';




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


export class Profile implements OnInit{
  data: any ="Initializeeed";

  private isNotFound:boolean = false;

  uploadedProfilePicture:File;


  isLock:boolean = false;
  finPosts:boolean = false;
  public publicationBeanList:Array<PublicationBean> = [];
  public user:User = new User();
  public userDisplayed:User = new User();
  btn_subscribe_locked:boolean=false;

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

  descriptionMaxLength:number = 360;

  loadingSub = false;
  online: any;
  constructor(public translate:TranslateService,
              private linkView:LinkView,
              private linkPreview:LinkPreview,
              private title:Title,
              private route:ActivatedRoute,
              private http:Http,
              private router:Router,
              private loginService:LoginService,
              private changeDetector:ChangeDetectorRef,
              private publicationTextService: PublicationTextService,
              private chatService :ChatService) {

    this.loginService.redirect();


    this.lastPostId = "";
    this.publicationBeanList = [];

    this.user = this.loginService.user;

    this.route.params.subscribe((params)=>{
      this.changeDetector.markForCheck();
      if (params['id'] != this.lastRouterProfileId) {
        this.lastRouterProfileId = params['id'];
        // uncommented the linebelow after removing resolver
         this.getProfile(params['id']);
        /* this.data = this.route.snapshot.data;
          let profileResponse = this.data.profile;
          let publicationResponse = this.data.publication;    
          if (profileResponse.status == "0") {
            this.userDisplayed = profileResponse.user;
            this.title.setTitle(this.userDisplayed.firstName + " " + this.userDisplayed.lastName);
            // uncommented the linebelow after removing resolver
            this.loadFirstPosts();
            this.isLock = true;
            this.showLoading = true;
            //console.log("first pub");
            this.publicationBeanList = [];
            this.putIntoList(publicationResponse);
            if(publicationResponse.length === 0){this.loadMore=false}
            this.changeDetector.markForCheck();
            if(publicationResponse.length === 0){this.loadMore=false}


          } else {
            this.isNotFound = true;
          }*/

      

      }
      window.scrollTo(0, 0);
    });

  }

  showSendMessagePopUp(){
    swal({
      title: this.translateCode("publication_popup_send_message_title"),
      text: this.translateCode("publication_popup_send_message_text"),
      showCancelButton: true,
      cancelButtonColor: '#999',
      confirmButtonColor: "#6bac6f",
      confirmButtonText: this.translateCode("send_msg"),
      cancelButtonText: this.translateCode("publication_popup_cancel_button"),
      input: 'textarea',
    }).then(function (text) {
        if (text) {
          this.sendMessage(text)
          swal({
            title: this.translateCode("publication_popup_notification_message_sent_title"),
            text: this.translateCode("publication_popup_notification_message_sent_text"),
            type: "success",
            timer: 1000,
            showConfirmButton: false
          }).then(function () {}, function (dismiss) {});
          this.changeDetector.markForCheck();
        }
      }.bind(this),
      function (dismiss) {
        if (dismiss === 'overlay') {}
      }
    );

    this.closeModalOtherProfile()
  }

  sendMessage(text){
    const messageText = text.trim();
    if (messageText === '' || messageText === undefined || messageText === null) {
      alert(`Message can't be empty.`);
    }else{
      let message ={
        fromUserId: this.user._id,
        message: (messageText).trim(),
        toUserId: this.userDisplayed._id,
      }
      this.chatService.sendMessage(message).subscribe(
        () => console.log('Sent Message server.'),
        err => console.log('Could send message to server, reason: ', err));
    }
  }
  
// Not Used
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
if (this.btn_subscribe_locked){
  return ;
}
    this.online = window.navigator.onLine;
    if(this.online){
      this.loadingSub = true;
    this.btn_subscribe_locked=true;
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
          this.loadMore =true;
         this.loadFirstPosts();
          userDisplayed.nbSubscribers++;

        }
      },
        err => {
      },
      () => {
        this.changeDetector.markForCheck();
        this.loadingSub = false;
        this.btn_subscribe_locked=false;

      }
    );
  }
  }

  unsubscribe(userDisplayed:User) {
    if (this.btn_subscribe_locked){
      return ;
    }
    this.online = window.navigator.onLine;
    if (this.online) {
      this.loadingSub = true;
        this.btn_subscribe_locked=true;
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
          this.loadMore =true;
          this.loadFirstPosts();
          userDisplayed.nbSubscribers--;

        }
      },
        err => {
      },
      () => {
        this.changeDetector.markForCheck();
        this.loadingSub = false;
        this.btn_subscribe_locked=false;

      }
    );
  }}

reportPub(userDisplayed:User) {
    swal({
      title: this.translateCode("profile_popup_report_title"),
      text: this.translateCode("publication_popup_report_text"),
      showCancelButton: true,
      cancelButtonColor: '#999',
      confirmButtonColor: "#6bac6f",
      confirmButtonText: this.translateCode("publication_popup_confirm"),
      cancelButtonText: this.translateCode("publication_popup_cancel_button"),
      input: 'textarea',
    }).then(function (text) {
        if (text) {
          this.doReportPub(text);
          swal({
            title: this.translateCode("publication_popup_notification_report_title"),
            text: this.translateCode("profile_popup_notification_report_text"),
            type: "success",
            timer: 1000,
            showConfirmButton: false
          }).then(function () {
          }, function (dismiss) {
          });
          this.changeDetector.markForCheck();
        }

      }.bind(this),
      function (dismiss) {
        if (dismiss === 'overlay') {}
      }
    );
    this.closeModalOtherProfile()
    this.unsubscribe(userDisplayed);
  }


  doReportPub(text) {
    let body = JSON.stringify({
      signalText: text,
      publId: this.userDisplayed._id,
      profileId: this.user._id
    });
    this.http.post(environment.SERVER_URL +  pathUtils.REPORT_PUBLICATION, body, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {


        },
        err => {
        },
        () => {
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
// Not Used
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
        
            this.publicationBeanList= this.publicationBeanList.map((pub:PublicationBean)=>{
            return {
              ...pub,
              profilePicture:response.profile.profilePicture,
              profilePictureMin:response.profile.profilePictureMin,
              comments:pub.comments.map((comment)=>{
               return {
                 ...comment ,
                 profilePicture:response.profile.profilePicture,
              profilePictureMin:response.profile.profilePictureMin
               }
              })
            }
          })
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
