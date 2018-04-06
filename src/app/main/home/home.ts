import { Input, Output, EventEmitter, Component, ChangeDetectorRef, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Ng2ImgMaxService } from 'ng2-img-max';
import 'rxjs/add/operator/map';


import { Publication } from '../../publication/publication';
import { Comment } from '../../comment/comment';

/* conf */
import { AppSettings } from '../../conf/app-settings';

/** Utils */
import * as pathUtils from '../../utils/path.utils';

/* services */
import { LoginService } from '../../service/loginService';
import { LinkView } from "../../service/linkView";
import { LinkPreview } from "../../service/linkPreview";
import { PostService } from "../../service/postService";
import { TranslateService } from 'ng2-translate';

/* user  */
import { User } from '../../beans/user';

/* beans */
import { PublicationBean } from '../../beans/publication-bean';
import { NotFound } from "../notFound/not-found";
import { Title } from "@angular/platform-browser";
import { LinkBean } from '../../beans/linkBean';
import {environment} from "../../../environments/environment";

declare var jQuery:any;
declare var $:any;
declare var FB:any;
declare var auth:any;
declare const gapi:any;
@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Home implements OnInit {
  form;
  uploadedPicture:File;
  isLock:boolean = false;
  public publicationBeanList:Array<PublicationBean> = [];
 public user:User = new User();

  public link:LinkBean = new LinkBean();
  public previewLink:Array<LinkBean> = [];

  //Variables Declarations
  titleEnable = false;
  youtubeInput = false;
  youtubeLink = "";
  menuFilter = "recent";
  selectedMenuElement = 0;
  nbLoadedPosts = 10;
  failureMessage;
  showLoading = false;
  errorMsg = "";
  lastPostId:string = "null";
  publication;
  loadingPublish = false;
  pubText:string;
  publishText:string;
  linkLoading = false;
  isEmpty = true;
  showSuggestionMSG = false;
  keepLoading = true;

  constructor(public translate:TranslateService,
              private postService:PostService,
              private linkView:LinkView,
              private linkPreview:LinkPreview,
              private title:Title,
              private http:Http,
              private router:Router,
              private loginService:LoginService,
              private changeDetector:ChangeDetectorRef,
              private ng2ImgMaxService: Ng2ImgMaxService) {

    this.loginService.redirect();

    this.user = this.loginService.getUser();

    this.postService.setShowErrorConnexion(false);

    this.form = new FormGroup({
      publicationTitle: new FormControl(),
      publicationText: new FormControl('', Validators.required),
      publicationYoutubeLink: new FormControl()
    });

    this.publicationBeanList = [];
    this.loadFirstPosts();
    // if (!this.publicationBeanList.length)
    // this.loadFirstPosts();
    // window.scrollTo(0, 0);

    this.menuFilter = 'recent';

  }

  ngOnInit() {

   jQuery("#publishDiv").on("paste", function (e) {
      e.preventDefault();
      var pastedData = e.originalEvent.clipboardData.getData('text');
      alert(pastedData);

    });

    jQuery("#errorMsgDisplay").hide();
    jQuery(("#file-image")).change(function () {
      jQuery((".file-input-holder")).show();
      readURL(this);
    });

    jQuery(("#file-image-gif")).change(function () {
      jQuery((".file-input-holder")).show();
      readURL(this);
    });

    jQuery(document).click(function (e) {

      if (jQuery(e.target).closest(".select-menu").length === 0 && jQuery(e.target).closest(".dropdown").length === 0) {
        jQuery(".select-menu").hide();
      }
    });
    this.changeDetector.markForCheck();


  }


  closeWelcomeMsg() {
    jQuery("#welcomeMsgDisplay").fadeOut(1000);
    this.user.isNewInscri = false;
    this.loginService.updateUser(this.user);
  }

  putNewPub(pub:PublicationBean, isShared:boolean) {
    var element = pub;
    element.displayed = true;
    if (isShared) {
      element.isShared = true;
    }
    else {
      element.isShared = false;
    }
    this.publicationBeanList.unshift(element);
    this.changeDetector.markForCheck();
  }

  checkPreviewLink($event) {
    this.pubText = jQuery("#pubText").val();
    this.changeDetector.markForCheck();
    this.linkView.getListLinks(this.pubText);
  }

  putIntoList(response) {
    if (!response.length || response.length < 10) {
      this.showLoading = false;
      this.isLock = false;
      this.showSuggestionMSG = true;
      this.keepLoading = false;
      return;
    }
    this.showSuggestionMSG = false;
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

    if (response.length < 10) {
      this.showSuggestionMSG = true;
    }
  }

  loadFirstPosts() {
    this.isLock = true;
    this.showLoading = true;
    let urlAndPara = environment.SERVER_URL + pathUtils.GET_PUBLICATIONS;
    this.http.get(
      urlAndPara, AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {
        //this.publicationBeanList = [];
        this.putIntoList(response);
        this.changeDetector.markForCheck();
      },
        err => {
        setTimeout(() => {
          this.showLoading = false;
          this.isLock = true;
          this.keepLoading = false;
          this.changeDetector.markForCheck();
        }, 3000);
      },
      () => {
      }
    );

  }

  loadMorePosts() {
    if(this.keepLoading) {
      this.isLock = true;
      this.showLoading = true;
      let urlAndPara = environment.SERVER_URL
        + pathUtils.GET_PUBLICATIONS + this.lastPostId;
      this.http.get(
        urlAndPara, AppSettings.OPTIONS)
        .map((res:Response) => res.json())
        .subscribe(
          response => {
          this.putIntoList(response);
          this.changeDetector.markForCheck();
        },
          err => {
            setTimeout(() => {
              this.showLoading = false;
              this.isLock = true;
              this.keepLoading = false;
            }, 3000);
          },
        () => {
        }
      );
    }
  }

  onScrollDown() {
    if ((((this.lastPostId == "null") || (!this.lastPostId)
      || (this.isLock)) || !$(window).scrollTop())) {
      return;
    }
    else {
      this.loadMorePosts();
      return 1;
    }
  }

  updatePublishTextOnPaste($event) {
    $event.preventDefault();
    var text = $event.clipboardData.getData("text/plain");

    if (text.search("youtube.com/watch") >= 0 || text.search("youtu.be/") >= 0) {
      this.youtubeInput = true;
      jQuery(".yt-in-url").val(text);
      this.changeDetector.markForCheck();
      this.youtubeLink = text;
      this.updateYoutube();
      return 1;
    }
    this.analyzeLink(text);
    document.execCommand("insertHTML", false, text);
  }


  resetPublishPicture() {
    jQuery("#preview-image").attr('src', "");
    jQuery("#preview-image").hide();
    this.uploadedPicture = null;
  }

  resetPublish() {
    jQuery("#file-image").val("");
    jQuery("#file-image-gif").val("");
    jQuery("#preview-image").attr('src', '');
    jQuery("#preview-image").fadeOut();
    this.uploadedPicture = null;
    this.titleEnable = false;
    this.youtubeInput = false;
    this.youtubeLink = null;
    jQuery(".yt-in-url").val("");
    jQuery(".youtube-preview").html("");
    this.loadingPublish = false;
    jQuery(".textarea-publish").html("");
    this.closeLinkAPI();
    this.isEmpty = true;
    this.changeDetector.markForCheck();
  }

  publish() {
    this.form.value.publicationText = jQuery("#publishDiv").text();
    if (!this.form.value.publicationText && !this.youtubeLink && !this.uploadedPicture && !this.link.isSet) {
      this.errorMsg = "SP_FV_ER_PUBLICATION_EMPTY";
      this.errorTimed();
      return;
    }
    this.loadingPublish = true;
    var data = new FormData();
    data.append('profileId', this.user._id);
    if (this.selectedMenuElement == 0) {
      data.append('confidentiality', 'PUBLIC');
    }
    else {
      data.append('confidentiality', 'PRIVATE');
    }
    data.append('publTitle', this.form.value.publicationTitle);
    data.append('publText', this.form.value.publicationText);
    data.append('publyoutubeLink', this.youtubeLink);
    data.append('publPicture',this.uploadedPicture);

    // clear title value
    this.form.reset();

    if (this.link.isSet) {
      data.append('publExternalLink', this.link.url);
    }
    this.changeDetector.markForCheck();
    this.http.post(environment.SERVER_URL + pathUtils.PUBLISH, data, AppSettings.OPTIONS_POST)
      .map((res:Response) => res.json())
      .subscribe(
        response => {

        if (response.status == "0") {
          jQuery("#errorMsgDisplay").fadeOut(1000);
          this.putNewPub(response.publication, false);
          this.resetPublish();
        }
        else {
          this.errorMsg = response.error;
          this.errorTimed();
        }
      },
        err => {
          console.log(err)
        this.errorMsg = "SP_ER_TECHNICAL_ERROR";
      },
      () => {
        this.loadingPublish = false;
      }
    );
  }

  enableTitlePost() {
    this.titleEnable = !this.titleEnable;
  }

  emptyDivOnFocus() {
    jQuery("#placehoder-publish").remove();
  }

  //change Menu Filter
  changeMenuFilter(newMenufilter:string) {
    this.menuFilter = newMenufilter;
    localStorage.setItem('typePosts', newMenufilter);
    this.publicationBeanList = [];
    this.publicationBeanList = this.postService.loadFirstPosts();
  }

  //select Menu Home
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

  //error close
  closeErrorMsg() {
    jQuery("#errorMsgDisplay").fadeOut(1000);
    this.errorMsg = "";
  }

  errorTimed() {
    jQuery("#errorMsgDisplay").fadeIn(500);
    $('html, body').scrollTop(
      $("#errorMsgDisplay").offset().top - $(".main-header").innerHeight() - 10
    );
    //document.querySelector("#errorMsgDisplay").scroll; //.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      jQuery("#errorMsgDisplay").fadeOut(1000);
    }, 5000);
    setTimeout(() => {
      this.errorMsg = "";
    }, 5200);

  }

  //uploading Photo click event
  addPhoto() {
    jQuery(("#file-image")).click();
  }

  addPhotoGIF() {
    jQuery(("#file-image-gif")).click();
  }

  //uploading photo or GIF
  uploadPhoto($event) {

    var inputValue = $event.target;

    if (inputValue != null && null != inputValue.files[0]) {
      
      this.uploadedPicture = inputValue.files[0];
      //change
      this.ng2ImgMaxService.resize([this.uploadedPicture], 900, 600).subscribe( result =>{
      this.ng2ImgMaxService.compress([result], 0.5).subscribe( result =>{
        this.uploadedPicture=result;

        previewFile(this.uploadedPicture);
        jQuery(".youtube-preview").html("");
        //this.form.controls.publicationYoutubeLink.updateValue('');
        this.closeLinkAPI();
        return this.uploadedPicture;
        });
        });    
          //this.uploadedPicture=result;

      //previewFile(this.uploadedPicture);
     /* jQuery(".youtube-preview").html("");
      //this.form.controls.publicationYoutubeLink.updateValue('');
      this.closeLinkAPI();
      return this.uploadedPicture;*/
//change
    }
    else {
      this.uploadedPicture = null;
      return null;
    }
  }

  uploadPhotoGIF($event) {
    var inputValue = $event.target;
    if (inputValue != null && null != inputValue.files[0]) {
      this.uploadedPicture = inputValue.files[0];
      previewFile(this.uploadedPicture);
      jQuery(".youtube-preview").html("");
    }
    else {
      this.uploadedPicture = null;
    }
  }


  getIdYoutubeVideoId(youtubeLink):string {

    if (youtubeLink.indexOf("youtube.com") > 0) {
      var video = "";
      var a = youtubeLink.split("?");
      var b = a[1];
      var c = b.split("&");
      for (var i = 0; i < c.length; i++) {
        var d = c[i].split("=");
        if (d[0] == "v") {
          return d[1];
        }
      }
    } else if (youtubeLink.indexOf("youtu.be") > 0) {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = youtubeLink.match(regExp);
      if (match && match[2].length == 11) {
        return match[2];
      }
    }
    return 'error';
  }

  displayYoutubeLinkError() {
    this.errorMsg = "Votre lien Youtube est invalide! Veuillez mettre un lien Youtube Valide.";
    this.errorTimed();
    jQuery(".youtube-preview").html("");
  }

  updateYoutube() {
    var a = jQuery(".yt-in-url");
    let videoId = this.getIdYoutubeVideoId(a.val());

    try {
      if (videoId == 'error') {
        this.displayYoutubeLinkError();
        return;
      }

      jQuery(".youtube-preview").html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>');
      this.uploadedPicture = null;
      this.closeLinkAPI();
      this.youtubeLink = videoId;
      jQuery("#preview-image").hide();

    } catch (err) {
      this.displayYoutubeLinkError();
    }
  }

  closeLinkAPI() {
    this.link.initialise();
  }


  linkAPI() {
    var source = (this.publishText || '').toString();
    //this.analyzeLink(source);
  }


  analyzeLink(source) {
    {
      console.log("analyse" + source);
      var myArray = this.linkView.getListLinks(source);
      if (!myArray.length) {
        return 1;
      }
      var linkURL = myArray[0];
      if (linkURL == this.link.url) {
        return 1;
      }
      if (linkURL.search("youtube.com/watch") >= 0 || linkURL.search("youtu.be/") >= 0) {
        jQuery(".yt-in-url").val(linkURL);
        this.updateYoutube();
        return 1;
      }
      if (linkURL.search(".gif") >= 0) {
        var checker = linkURL.substr(linkURL.length - 13, 8);
        if (checker.indexOf(".gif") >= 0) {
          this.link.image = linkURL.substring(0, linkURL.indexOf(".gif") + 4);
          this.link.imageWidth = 500;
          this.link.imageHeight = 500;
          this.link.isGif = true;
          this.link.url = linkURL.substring(0, linkURL.indexOf(".gif") + 4);
          this.link.title = "gif";
          this.link.description = "gif";
          this.link.isSet = true;
          return 1;
        }
      }
      this.linkLoading = true;
      this.http.get(
        environment.SERVER_URL
        + pathUtils.GET_OPEN_GRAPH_DATA + linkURL,
        AppSettings.OPTIONS)
        .map((res:Response) => res.json())
        .subscribe(
          response => {
          if (response.results.success) {
            this.resetPublishPicture();
            jQuery(".youtube-preview").html("");
            //this.form.controls.publicationYoutubeLink.updateValue('');
            this.link.url = linkURL.substring(0, linkURL.length - 6);
            this.link.title = response.results.data.ogTitle;
            this.link.description = response.results.data.ogDescription;
            if (response.results.data.ogImage) {
              var a = response.results.data.ogImage.url;
              this.link.image = response.results.data.ogImage.url;
              this.link.imageWidth = response.results.data.ogImage.width;
              this.link.imageHeight = response.results.data.ogImage.height;
              if (a.substring(a.length - 3, a.length) == "gif")
                this.link.isGif = true;
              else
                this.link.isGif = false;
            }
            else {
              this.link.image = null;
              this.link.imageWidth = 0;
              this.link.imageHeight = 0;
            }
            this.link.isSet = true;
            this.linkLoading = false;
            this.changeDetector.markForCheck();

          }
        },
          err => {
          console.error("error in link API;");
        },
        () => {
          this.linkLoading = false;
        }
      );
    }
  }



  pasteInnerHtml($event) {
    $event.preventDefault();
    var plainText = $event.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, plainText);
  }
}

export function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = [];
    reader.push(new FileReader());
    reader[0].addEventListener("load", (event) => {

   jQuery("#preview-image").show();

    }, false);
    if (input.files[0]) {
      reader[0].readAsDataURL(input.files[0]);
    }
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
