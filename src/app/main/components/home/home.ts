import { GifBean } from './../../../beans/gif-bean';
import 'rxjs/add/operator/map';

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Http, Response} from '@angular/http';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Ng2ImgMaxService} from 'ng2-img-max';

import {environment} from '../../../../environments/environment';
import {LinkBean} from '../../../beans/linkBean';
import {PublicationBean} from '../../../beans/publication-bean';
import {User} from '../../../beans/user';
import {LoginService} from '../../../login/services/loginService';
import {AppSettings} from '../../../shared/conf/app-settings';
import * as pathUtils from '../../../utils/path.utils';
import {LinkPreview} from '../../services/linkPreview';
import {LinkView} from '../../services/linkView';
import {NotificationService} from '../../services/notification.service';
import {PostService} from '../../services/postService';
import { GifListBean } from '../../../beans/gif-list-bean';
import { GifService } from '../../services/gifService';


declare var jQuery: any;
declare var $: any;
declare var FB: any;
declare var auth: any;
declare const gapi: any;
declare var window: any;

@Component({
  moduleId: module.id,
  selector: "home",
  templateUrl: "home.html",
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  form;
  uploadedPicture: File;
  isLock: boolean = false;
  public publicationBeanList: Array<PublicationBean> = [];
  public user: User = new User();

  public link: LinkBean = new LinkBean();
  public previewLink: Array<LinkBean> = [];

  //Variables Declarations
  urlGIF = "https://9gag.com/gag/aq7W4rj";
  imageGIF = "https://images-cdn.9gag.com/photo/aq7W4rj_700b.jpg";

  public GifList: Array<GifBean> = [];

  linkDomain = "";
  titleEnable = false;
  youtubeInput = false;
  youtubeLink = "";
  facebookInput = false;
  facebookLink = "";
  menuFilter = "recent";
  selectedMenuElement = 0;
  nbLoadedPosts = 10;
  failureMessage;
  showLoading = false;
  errorMsg = "";
  lastPostId: string = "null";
  publication;
  loadingPublish = false;
  pubText: string;
  publishText: string;
  linkLoading = false;
  isEmpty = true;
  showSuggestionMSG = false;
  keepLoading = true;
  touch_start_position: number;
  online: any;
  public pubInputHtml: string = "";
  public arabicText: boolean = false;
  arabicRegex: RegExp = /[\u0600-\u06FF]/;
  public imageFromLink: boolean = false;

  /* tag search */
  searchValue: string;
  listTagSearchUsers: Array<User> = [];
  noSearchResults: Boolean = false;


  translationLanguages = [{name: 'English (US)', value: 'en'},
    {name: 'Français (France)', value: 'fr'},
    {name: '     Español (España)', value: 'es'}];
  selectedLanguage: String;


  //check if there is more post to retreive from server
  morePosts = true;

  // Notification vars
  private subscriptionJson = '';
  private isSubscribed: boolean = true;
  private registration = undefined;
  private tagDropdownActive: boolean = false;
  private hashTagPos: number;
  private showGifSlider:boolean = false;

  @ViewChild("homeSidebarLeft") homeSidebarLeftRef: ElementRef;
  @ViewChild("homeSideBarRight") homeSidebarRightRef: ElementRef;
  @ViewChild("newPubForm") newPubFormRef: ElementRef;

  // end Notification vars

  constructor(public translate: TranslateService,
              private postService: PostService,
              private linkView: LinkView,
              private linkPreview: LinkPreview,
              private gifService: GifService,
              private title: Title,
              private http: Http,
              private router: Router,
              private loginService: LoginService,
              private changeDetector: ChangeDetectorRef,
              private ng2ImgMaxService: Ng2ImgMaxService,
              private renderer: Renderer2,
              //Notiifcation
              public notificationService: NotificationService,
              private ref: ChangeDetectorRef) {

    this.isSubscribed = true;
    this.loginService.redirect();

    this.user = this.loginService.getUser();

    this.postService.setShowErrorConnexion(false);

    this.form = new FormGroup({
      publicationTitle: new FormControl(),
      publicationText: new FormControl("", Validators.required),
      publicationYoutubeLink: new FormControl()
    });

    this.publicationBeanList = [];
    this.loadFirstPosts();
    // if (!this.publicationBeanList.length)
    // this.loadFirstPosts();
    // window.scrollTo(0, 0);

    this.menuFilter = "recent";
    this.title.setTitle("Speegar");

    this.GifList = gifService.getGifList().list;
  }

  ngOnInit() {
    window.onscroll = () => {
      let k = this.newPubFormRef.nativeElement.offsetTop - window.pageYOffset;
      let className = 'side-content-detached';
      if(k < 0) {
        console.log('oups!');
        this.renderer.addClass(this.homeSidebarLeftRef.nativeElement, className);
        this.renderer.addClass(this.homeSidebarRightRef.nativeElement, className);
      }
      else {
        this.renderer.removeClass(this.homeSidebarLeftRef.nativeElement, className);
        this.renderer.removeClass(this.homeSidebarRightRef.nativeElement, className);
      }
    };



    this.selectedLanguage = localStorage.getItem('userLang');
    //Notification Check
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('assets/sw.js').then(reg => {
        this.registration = reg;
        this.notificationService.init(reg);
        //console.log('Service Worker and Push is supported');
      });
    } else {
      //console.warn('Push messaging is not supported');
    }

    jQuery("#publishDiv").on("paste", function (e) {
      e.preventDefault();
      var pastedData = e.originalEvent.clipboardData.getData("text");
      alert(pastedData);
    });

    jQuery("#errorMsgDisplay").hide();
    jQuery("#file-image").change(function () {
      jQuery(".file-input-holder").show();
      readURL(this);
    });

    jQuery("#file-image-gif").change(function () {
      jQuery(".file-input-holder").show();
      readURL(this);
    });

    jQuery(document).click(function (e) {
      if (
        jQuery(e.target).closest(".select-menu").length === 0 &&
        jQuery(e.target).closest(".dropdown").length === 0
      ) {
        jQuery(".select-menu").hide();
      }
    });
    this.changeDetector.markForCheck();

    setTimeout(function () {
      document.documentElement.scrollTop = 0;
    }, 1000);

  }

  closeWelcomeMsg() {
    jQuery("#welcomeMsgDisplay").fadeOut(1000);
    this.user.isNewInscri = false;
    this.loginService.updateUser(this.user);
  }

  putNewPub(pub: PublicationBean, isShared: boolean) {
    let element = pub;
    element.displayed = true;
    element.isShared = isShared;
    this.publicationBeanList.unshift(element);
    this.changeDetector.markForCheck();
  }

  checkPreviewLink($event) {
    this.pubText = jQuery("#pubText").val();
    this.changeDetector.markForCheck();
    this.linkView.getListLinks(this.pubText);
  }

  checkTyping(publishDivRef) {
    let text = publishDivRef.textContent;
    this.checkTag(publishDivRef);
    this.checkArabic(text);

  }

  /*----------------------------------*/

  checkTag(publishDivRef) {
    // let caretPosition = publishDivRef.caretPosition();
    // console.log(caretPosition);

    let text = publishDivRef.textContent;
    console.log(text[text.length - 1]);
    if (!this.tagDropdownActive && // text.search(/.*?\ \@$/g) > 0) {
      text[text.length - 2] == ' ' &&
      text[text.length - 1] == '@') {
      this.tagDropdownActive = true;
      this.hashTagPos = text[text.length - 1];
      console.log("detect tag is working");
    }
    if (this.tagDropdownActive) {
      let tagText = text.split('@')[1];
      this.listTagSearchUsers = [];
      if (tagText.length > 1) {
        this.getListSearchUsers(tagText);
      }
    }
  }


  getListSearchUsers(key: string) {
    // this.showRecentSearch = false;
    this.http
      .get(
        environment.SERVER_URL + pathUtils.FIND_PROFILE + key,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          this.listTagSearchUsers = [];
          this.noSearchResults = false;
          this.changeDetector.markForCheck();
          for (let i = 0; i < this.listTagSearchUsers.length; i++) {
            this.listTagSearchUsers.pop();
            this.changeDetector.markForCheck();
          }
          if (response.status == 0) {
            if (response.profiles)
              for (let i = 0; i < response.profiles.length; i++) {
                this.listTagSearchUsers[i] = response.profiles[i];
                this.changeDetector.markForCheck();
              }
          }
        },
        err => {
          this.noSearchResults = true;
        },
        () => {
          this.noSearchResults = this.listTagSearchUsers.length == 0;
          this.changeDetector.markForCheck();
        }
      );
  }


  /*----------------------------------*/

  checkArabic(text) {
    this.arabicText = this.arabicRegex.test(text[0]);
  }

  putIntoList(response) {
    if (!response.length) {
      this.showLoading = false;
      this.isLock = false;
      this.showSuggestionMSG = true;
      this.keepLoading = false;
      return;
    }
    this.showSuggestionMSG = false;
    let element;
    for (let i = 0; i < response.length; i++) {
      element = response[i];
      element.displayed = true;

      element.isShared = response[i].isShared == "true";

      element.isLiked = response[i].isLiked == "true";

      element.isDisliked = response[i].isDisliked == "true";

      for (let j = 0; j < response[i].comments.length; j++) {
        element.comments[j].isLiked = response[i].comments[j].isLiked == "true";

        element.comments[j].isDisliked = response[i].comments[j].isDisliked == "true";

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
    this.http
      .get(urlAndPara, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          //this.publicationBeanList = [];
          this.putIntoList(response);
          if (response.length == 0) {
            this.morePosts = false
          }
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
    if (this.keepLoading) {
      this.isLock = true;
      this.showLoading = true;
      let urlAndPara =
        environment.SERVER_URL + pathUtils.GET_PUBLICATIONS + this.lastPostId;
      this.http
        .get(urlAndPara, AppSettings.OPTIONS)
        .map((res: Response) => res.json())
        .subscribe(
          response => {
            this.putIntoList(response);
            if (response.length == 0) {
              this.morePosts = false
            }
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
    if (
      this.lastPostId == "null" ||
      !this.lastPostId ||
      this.isLock ||
      !$(window).scrollTop()
    ) {
      return;
    } else {
      this.loadMorePosts();
      return 1;
    }
  }

  previewGIF(urlGIF){
    var linkURL = urlGIF;
    this.http
      .get(
        environment.SERVER_URL + pathUtils.GET_OPEN_GRAPH_DATA + linkURL,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.results.success) {
            jQuery("#publishDiv").empty();
            this.resetPublishPicture();
            jQuery(".video-preview").html("");
            var r = /:\/\/(.[^/]+)/;
            this.linkDomain = linkURL.match(r)[1];
            this.link.url = linkURL;
            console.log(linkURL);
            this.link.title = response.results.data.ogTitle;
            this.link.description = response.results.data.ogDescription;
            if (response.results.data.ogImage) {
              var a = response.results.data.ogImage.url;
              this.link.image = response.results.data.ogImage.url;
              this.link.imageWidth = response.results.data.ogImage.width;
              this.link.imageHeight = response.results.data.ogImage.height;
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
          this.linkLoading = false;
        },
        err => {
          console.error("error in link API;");
        },
        () => {
          this.linkLoading = false;
        }
      );

  }

  updatePublishTextOnPaste($event) {
    $event.preventDefault();
    let text = $event.clipboardData.getData("text/plain");

    if (
      text.search("youtube.com/watch") >= 0 ||
      text.search("youtu.be/") >= 0
    ) {
      this.youtubeInput = true;
      jQuery(".yt-in-url").val(text);
      this.changeDetector.markForCheck();
      this.youtubeLink = text;
      this.updateYoutubeFacebook();
      return 1;
    }

    if (
      text.search("web.facebook.com") >= 0 || text.search("www.facebook.com") > 0 ||
      text.search("m.facebook.com") > 0 || text.search("mobile.facebook.com") > 0) {
      this.facebookInput = true;
      jQuery(".yt-in-url").val(text);
      this.changeDetector.markForCheck();
      this.facebookLink = text;
      this.updateYoutubeFacebook();
      return 1;
    }
    if (text.search(/(\.jpg)|(\.jpeg)|(\.png)|(\.gif)$/i) > 0) {
      //console.log("image detected");
      jQuery("#preview-image").attr("src", text);
      jQuery(".file-input-holder").show();
      jQuery("#preview-image").show();
      this.imageFromLink = true;
      this.youtubeLink = null;
      this.facebookLink = null;

      this.uploadedPicture = null;
      jQuery(".youtube-preview").html("");
      jQuery(".facebook-preview").html("");
      this.link.isSet = false;
      return 1;
    }
    this.analyzeLink(text);
    text = text.replace(/(?:\r\n|\r|\n)/g, "<br>");
    document.execCommand("insertHTML", false, text);
  }

  resetPublishPicture() {
    jQuery("#preview-image").attr("src", "");
    jQuery("#preview-image").hide();
    this.imageFromLink = false;
    this.uploadedPicture = null;
  }

  resetPublish() {
    jQuery("#file-image").val("");
    jQuery("#file-image-gif").val("");
    jQuery("#preview-image").attr("src", "");
    jQuery("#preview-image").fadeOut();
    this.uploadedPicture = null;
    this.titleEnable = false;
    this.youtubeInput = false;
    this.youtubeLink = "";
    this.facebookInput = false;
    this.facebookLink = "";
    jQuery(".yt-in-url").val("");
    jQuery(".youtube-preview").html("");
    jQuery(".facebook-preview").html("");
    this.loadingPublish = false;
    jQuery(".textarea-publish").html("");
    this.closeLinkAPI();
    this.isEmpty = true;
    this.changeDetector.markForCheck();
  }

  publish() {


    this.online = window.navigator.onLine;

    let txt: string = jQuery("#publishDiv").html();

    let white_space_regex: RegExp = /^(\ |\&nbsp;|\<br\>)*$/g;
    if (
      //!this.form.value.publicationText &&
      white_space_regex.test(txt)
      && !this.youtubeLink
      && !this.facebookLink
      && !this.uploadedPicture
      && !this.link.isSet
      && !this.imageFromLink) {
      this.errorMsg = "SP_FV_ER_PUBLICATION_EMPTY";
      this.errorTimed();
      return;
    }

    txt = txt.replace(/(\&nbsp;|\ )+/g, ' ')
      .replace(/(\<.?br\>)+/g, '<br>')
      .replace(/^\<.?br\>|\<.?br\>$/g, '');

    // when image form link is passed
    this.imageFromLink = this.imageFromLink
      && !this.youtubeLink
      && !this.facebookLink
      && !this.uploadedPicture
      && !this.link.isSet;

    let img_src: string = jQuery('#preview-image').attr('src');
    if (this.imageFromLink) {
      this.imageFromLink = false;
      if (img_src && img_src.length) {

        let br: string = txt.length ? '<br>' : "";
        txt += `${br}<img src="${img_src}" class='image-from-link'>`;
      }
    }


    if (this.youtubeLink) {
      jQuery(".yt-in-url").hide();
    }
    if (this.facebookLink) {
      jQuery(".yt-in-url").hide();
    }

    this.form.value.publicationText = txt;

    let data = new FormData();
    data.append("profileId", this.user._id);
    if (this.selectedMenuElement == 0) {
      data.append("confidentiality", "PUBLIC");
    } else {
      data.append("confidentiality", "PRIVATE");
    }
    data.append("publTitle", this.form.value.publicationTitle);
    data.append("publText", this.form.value.publicationText);
    data.append("publyoutubeLink", this.youtubeLink);
    data.append("publfacebookLink", this.facebookLink);
    data.append("publPicture", this.uploadedPicture);
    // clear title value
    this.form.reset();

    if (this.link.isSet) {
      data.append("publExternalLink", this.link.url);
    }
    this.changeDetector.markForCheck();
    if (this.online) {
      this.loadingPublish = true;
      this.http
        .post(
          environment.SERVER_URL + pathUtils.PUBLISH,
          data,
          AppSettings.OPTIONS_POST
        )
        .map((res: Response) => res.json())
        .subscribe(
          response => {
            if (response.status == "0") {
              jQuery("#errorMsgDisplay").fadeOut(1000);
              this.putNewPub(response.publication, false);
              this.resetPublish();
            } else {
              this.errorMsg = response.error;
              this.errorTimed();
            }
            this.arabicText = false;
          },
          err => {
            console.log(err);
            this.errorMsg = "SP_ER_TECHNICAL_ERROR";
          },
          () => {
            this.loadingPublish = false;
          }
        );
    } else {
      this.errorMsg = "Intenet Connection Failed";
      this.errorTimed();

    }
  }

  enableTitlePost() {
    this.titleEnable = !this.titleEnable;
  }

  emptyDivOnFocus() {
    jQuery("#placehoder-publish").remove();
  }

  //change Menu Filter
  changeMenuFilter(newMenufilter: string) {
    this.menuFilter = newMenufilter;
    localStorage.setItem("typePosts", newMenufilter);
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
    $("html, body").scrollTop(
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
    jQuery("#file-image").click();
  }

  addPhotoGIF() {
    jQuery("#file-image-gif").click();
  }

  //uploading photo or GIF
  uploadPhoto($event) {
    var inputValue = $event.target;

    if (inputValue != null && null != inputValue.files[0]) {
      this.uploadedPicture = inputValue.files[0];
      //change

      this.ng2ImgMaxService
        .compress([this.uploadedPicture], 0.7)
        .subscribe(result => {
          this.uploadedPicture = result;

          previewFile(this.uploadedPicture);
          jQuery(".youtube-preview").html("");
          jQuery(".facebook-preview").html("");
          //this.form.controls.publicationYoutubeLink.updateValue('');
          this.closeLinkAPI();
          return this.uploadedPicture;
        });

      //this.uploadedPicture=result;

      //previewFile(this.uploadedPicture);
      /* jQuery(".youtube-preview").html("");
        //this.form.controls.publicationYoutubeLink.updateValue('');
        this.closeLinkAPI();
        return this.uploadedPicture;*/
      //change
    } else {
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
      jQuery(".facebook-preview").html("");
    } else {
      this.uploadedPicture = null;
    }
  }

  getIdFacebookVideo(facebookLink): string {

    let myRegexp = /(\/(videos\/)|(posts\/)|(v|(&|\?)id)=)(\d+)/;
    let match = facebookLink.match(myRegexp);
    if (match) {
      return match[match.length - 1];
    }


  }

  getPageFacebookVideo(videoLink): string {

    return "facebook";
  }

  getIdYoutubeVideoId(youtubeLink): string {
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
    return "error";
  }

  displayLinkError() {
    this.errorMsg =
      "Votre lien Youtube ou Facebook est invalide! Veuillez mettre un lien Valide.";
    this.errorTimed();
    jQuery(".youtube-preview").html("");
    jQuery(".facebook-preview").html("");
  }

  updateYoutubeFacebook() {
    var a = jQuery(".yt-in-url");
    var videoLink = a.val();
    var videoId;

    if (videoLink.indexOf("youtube.com") > 0 || videoLink.indexOf("youtu.be") > 0) {
      videoId = this.getIdYoutubeVideoId(videoLink);
      try {
        jQuery(".facebook-preview").html("");
        jQuery(".youtube-preview").html(
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/' +
          videoId +
          '" frameborder="0" allowfullscreen></iframe>'
        );
        this.uploadedPicture = null;
        this.closeLinkAPI();
        this.youtubeLink = videoId;
        jQuery("#preview-image").hide();
      } catch (err) {
        this.displayLinkError();
      }
    }
    else if (videoLink.indexOf("web.facebook.com") > 0 || videoLink.indexOf("www.facebook.com") > 0 ||
      videoLink.indexOf("m.facebook.com") > 0 || videoLink.indexOf("mobile.facebook.com") > 0) {
      videoId = this.getIdFacebookVideo(videoLink);
      var videoPage = this.getPageFacebookVideo(videoLink);
      //console.log("faceboook");
      try {
        jQuery(".youtube-preview").html("");
        jQuery(".facebook-preview").html(
          '<iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F' + videoPage + '%2Fvideos%2F' +
          videoId +
          '%2F&show_text=0&height=580&appId" width="500" height="580" style="border:none;overflow:none" scrolling="yes" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>'
        );

        this.uploadedPicture = null;
        this.closeLinkAPI();
        this.facebookLink = videoId;
        jQuery("#preview-image").hide();

      } catch (err) {
        this.displayLinkError();
      }
    }
    else {
      this.displayLinkError();
      return;
    }


  }

  closeLinkAPI() {
    this.link.initialise();
  }

  linkAPI() {
    let source = (this.publishText || "").toString();
    //this.analyzeLink(source);
  }

  analyzeLink(source) {

    let myArray = this.linkView.getListLinks(source);

    if (!myArray.length) {
      return 1;
    }
    let linkURL = myArray[0];
    //check if linkURL refers to speegar.com
    if (linkURL == this.link.url) {

      return 1;
    }
    if (
      linkURL.search("youtube.com/watch") >= 0 ||
      linkURL.search("youtu.be/") >= 0
    ) {
      jQuery(".yt-in-url").val(linkURL);
      this.updateYoutubeFacebook();
      return 1;
    }
    /*
    if (linkURL.search(/(\.gif)$/i) > 0) {
      console.log("this is a gif!");
      console.log(linkURL);
      //var checker = linkURL.substr(linkURL.length - 13, 8);
      //if (checker.indexOf(".gif") >= 0) {
      this.link.image = linkURL; //.substring(0, linkURL.indexOf(".gif") + 4);
      this.link.imageWidth = 500;
      this.link.imageHeight = 500;
      this.link.isGif = true;
      this.link.url = linkURL; //.substring(0, linkURL.indexOf(".gif") + 4);
      this.link.title = "gif";
      this.link.description = "gif";
      this.link.isSet = true;
      return 1;
      //}
    }
          */
    if (this.imageFromLink) {
      return 1
    }


    this.linkLoading = true;

    this.http
      .get(
        environment.SERVER_URL + pathUtils.GET_OPEN_GRAPH_DATA + linkURL,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.results.success) {
            jQuery("#publishDiv").empty();
            this.resetPublishPicture();
            jQuery(".video-preview").html("");
            //this.form.controls.publicationYoutubeLink.updateValue('');
            //console.log("hellooooooo");
            var r = /:\/\/(.[^/]+)/;
            this.linkDomain = linkURL.match(r)[1];
//              this.link.url = linkURL.substring(0, linkURL.length - 6);
            this.link.url = linkURL;

            this.link.title = response.results.data.ogTitle;
            this.link.description = response.results.data.ogDescription;
            if (response.results.data.ogImage) {
              var a = response.results.data.ogImage.url;
              this.link.image = response.results.data.ogImage.url;
              console.log(this.link.image);
              this.link.imageWidth = response.results.data.ogImage.width;
              this.link.imageHeight = response.results.data.ogImage.height;
              /*
              if (a.search(/(\.gif)$/i) > 0) {
                this.link.isGif = true;
                this.link.url = this.link.image;
              } else {
                this.link.isGif = false;
                this.linkLoading = false;
              }*/
            } else {
              this.link.image = null;
              this.link.imageWidth = 0;
              this.link.imageHeight = 0;
            }
            this.link.isSet = true;
            this.linkLoading = false;
            this.changeDetector.markForCheck();
          }
          this.linkLoading = false;
        },
        err => {
          console.error("error in link API;");
        },
        () => {
          this.linkLoading = false;
        }
      );
  }


  pasteInnerHtml($event) {
    $event.preventDefault();
    var plainText = $event.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, plainText);
  }


  onSelectLanguage(language: string) {
    this.selectedLanguage = language;
    language = language.toLowerCase();
    // jQuery(".dropdown-menu-translate").hide();
    localStorage.setItem('userLang', language);
    this.translate.setDefaultLang(language);
    location.reload();
    //console.log(localStorage.getItem('userLang')) ;
  }

  toggleTranslateDropdown() {
    jQuery(".dropdown-menu-translate").toggle();
  }


  useLanguage(language: string) {

  }

  toggleGifSlider() {
    this.showGifSlider = !this.showGifSlider;
}

}

export function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = [];
    reader.push(new FileReader());
    reader[0].addEventListener(
      "load",
      event => {
        jQuery("#preview-image").show();
      },
      false
    );
    if (input.files[0]) {
      reader[0].readAsDataURL(input.files[0]);
    }
  }
}

function previewFile(uploadedFile) {
  let preview = jQuery("#preview-image");
  let file = uploadedFile;
  let reader = new FileReader();

  reader.addEventListener(
    "load",
    function () {
      //preview.att.src = reader.result;
      jQuery("#preview-image").attr("src", reader.result);
      jQuery(".file-input-holder").fadeIn(500);
      jQuery("#preview-image").fadeIn(500);
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);

  }

}
