import "rxjs/add/operator/map";

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Http, Response } from "@angular/http";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Router, NavigationEnd } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Ng2ImgMaxService } from "ng2-img-max";
import { timer } from "rxjs/observable/timer";
import { Location } from '@angular/common';

import { environment } from "../../../../environments/environment";
import { CommentBean } from "../../../beans/comment-bean";
import { EmojiListBean } from "../../../beans/emoji-list-bean";
import { LinkBean } from "../../../beans/linkBean";
import { PublicationBean } from "../../../beans/publication-bean";
import { User } from "../../../beans/user";
import { MinifiedUser } from "../../../beans/Minified-user";
import { LoginService } from "../../../login/services/loginService";
import { AppSettings } from "../../../shared/conf/app-settings";
import * as pathUtils from "../../../utils/path.utils";
import { DateService } from "../../services/dateService";
import { EmojiService } from "../../services/emojiService";
import { LinkView } from "../../services/linkView";
import { PostService } from "../../services/postService";
import { SeoService } from "../../services/seo-service";
import * as _ from "lodash";
import { PublicationTextService } from "../../services/publicationText.service";

declare var jQuery: any;
declare var swal: any;

@Component({
  moduleId: module.id,
  selector: "publication",
  inputs: ["publicationBean"],
  templateUrl: "publication.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Publication {
  intervalHolder: any;
  commentContent = "";
  public hiddenContent: boolean = true;
  public i: number = 1;
  private isFixedPublishDate: boolean = false;
  private fixedPublishDate: string;
  public publicationBean: PublicationBean;
  // TODO: check publicationBean access
  private afficheCommentsLoading = false;
  public afficheMoreComments = false;
  public signalButton = false;
  public listComments: Array<CommentBean> = [];
  public myComments: Array<CommentBean> = [];
  private nbMaxAddComments = 3;
  private nbComments = 0;
  private nbDisplayedComments = 0;
  public user: User = new User();
  public dateDisplay = "";
  public listLink: Array<string> = [];
  formComment;
  selectedEmojiTab = 0;
  emojiOpacity = 0;
  emojiToggleActive = false;
  commentInputHtml = "";
  public modalPub = false;
  public pubLink = "";
  public shareLink = "";
  signalSubMenu = false;
  linkYtb = "";
  linkFb = "";
  url: SafeResourceUrl;
  listEmoji: Array<EmojiListBean> = [];
  newCommentText: string = "";
  uploadedPictureComment: File;
  likeAnimation = false;
  pubImgId;
  loadingComment = false;
  emojiHoverId = "";
  commentTextareaId = "";
  public link: LinkBean = new LinkBean();
  commentsDisplayed: boolean;
  /* long publication settings */
  private isLongText: boolean = false;
  private isLongTextShow: boolean = false;
  private firstPubText: string = "";
  private lastPubText: string = "";
  pub_text: string = "";
  arabicText: boolean = false;
  pubclass = "";
  pubbg = false;

  public profileId;
  allListComments: CommentBean[];
  showInteractionsModal: boolean = false;

  

  constructor(
    public translate: TranslateService,
    public seoService: SeoService,
    private postService: PostService,
    private linkView: LinkView,
    private emojiService: EmojiService,
    private http: Http,
    private router: Router,
    private sanitizer: DomSanitizer,
    private loginService: LoginService,
    private changeDetector: ChangeDetectorRef,
    private dateService: DateService,
    private ng2ImgMaxService: Ng2ImgMaxService,
    private location: Location,
    private publicationTextService: PublicationTextService,
  ) {
    if (window.matchMedia("(max-width: 768px)").matches) {
      if (location.path() != '') {
        if (location.path().indexOf('/main/post') != -1) {
          this.hiddenContent = true;
        } else {
          this.hiddenContent = false;
        }
      }
    }
    loginService.actualize();

    this.user = loginService.user;
    this.profileId = this.user._id;
    this.listEmoji = emojiService.getEmojiList();
    this.pubImgId = "imgDefault";
    this.formComment = new FormGroup({
      pubComment: new FormControl("", Validators.required),
      commentText: new FormControl("", Validators.required)
    });
  }
  unsubscribe(post: PublicationBean) {
    let body = JSON.stringify({
      profileId: post.profileId
    });

    this.http
      .post(
        environment.SERVER_URL + pathUtils.UNSUBSCRIBE,
        body,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.status == 0) {
            this.user.isFollowed = false;
            this.user.nbSubscribers--;
            this.unsubscribeMessage();
            }
          },
        err => { },
          () => {
              this.changeDetector.markForCheck();
            }
        );
  }
unsubscribeMessage() {
swal({
title: this.translateCode(
"publication_popup_notification_unsubscribe_title"
),
text: this.translateCode(
"publication_popup_notification_unsubscribe_text"
),
type: "success",
timer: 2000,
showConfirmButton: false
}).then(function () {
}, function (dismiss) {
});
}

  deletePub() {
    swal({
      title: this.translateCode("publication_popup_confirmation_title"),
      text: this.translateCode("publication_popup_confirmation_delete_text"),
      showCancelButton: true,
      cancelButtonColor: "#999",
      confirmButtonColor: "#6bac6f",
      confirmButtonText: this.translateCode(
        "publication_popup_confirmation_delete_button"
      ),
      cancelButtonText: this.translateCode("publication_popup_cancel_button"),
      allowOutsideClick: true
    }).then(
      function () {
        this.doDeletePub();
        this.closeModalPub();
        swal({
          title: this.translateCode(
            "publication_popup_notification_delete_title"
          ),
          text: this.translateCode(
            "publication_popup_notification_delete_text"
          ),
          type: "success",
          timer: 1000,
          showConfirmButton: false
        }).then(function () { }, function (dismiss) { });
        this.changeDetector.markForCheck();
      }.bind(this),
      function (dismiss) {
        if (dismiss === "overlay") {
        }
      }
    );
  }

  doDeletePub() {
    this.publicationBean.displayed = false;
    this.changeDetector.markForCheck();
    var body;
    body = JSON.stringify({
      publId: this.publicationBean._id
    });

    this.http
      .post(
        environment.SERVER_URL + pathUtils.REMOVE_PUBLICATION,
        body,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => { },
        err => { },
        () => {
          this.changeDetector.markForCheck();
        }
      );
  }

  focused(element) {
    if (window.matchMedia("(max-width: 768px)").matches) {
      jQuery("#" + element.commentTextareaId)
        .parent()
        .parent()
        .css({
          'margin': "0px",
          'position': "fixed",
          'bottom': "0",
          'background-color': "white",
          'z-index': "10000",
          'left': '0'
        });
      jQuery('.publishImage').show();
      jQuery(".navigation-bottom").hide();
      jQuery("#" + element.commentTextareaId).blur(function () {
        jQuery("#" + element.commentTextareaId)
          .parent()
          .parent()
          .css({ position: "unset", margin: "0 0 12px 0" });
        jQuery(".navigation-bottom").show();
      });
    } else {
      jQuery('.publishImage').show();
    }
  }

  // initComments() {

  //   if (this.publicationBean.comments.length > this.nbMaxAddComments) {
  //     this.afficheMoreComments = true;
  //     this.nbComments = this.nbMaxAddComments;
  //     for (let i = 0; i < this.nbComments; i++)
  //       this.listComments.push(this.publicationBean.comments[i]);
  //   }
  //   else {

  //     for (let i = 0; i < this.nbComments; i++)

  //       this.listComments.push(this.publicationBean.comments[i]);
  //   }

  // }

  initComments() {
    this.allListComments = this.publicationBean.comments;

    if (this.allListComments.length <= 3) {
      this.afficheMoreComments = false;
      this.listComments = this.allListComments.slice(0, this.allListComments.length);

    }
    else {
      this.afficheMoreComments = true;

      this.listComments = this.allListComments.slice(0, this.nbMaxAddComments);
    }
    this.changeDetector.markForCheck();


  }


  displayComments() {
    this.commentsDisplayed = !this.commentsDisplayed;
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalHolder);
  }

  ngOnInit() {
    this.intervalHolder = setInterval(() => {
      // Let's refresh the list.
      this.changeDetector.markForCheck();
    }, 1000 * 60); // 1 minute

    // Get the modal
    var popupmodal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var img = jQuery(".myImg");
    var popupmodalImg = jQuery("#img01");
    jQuery(".myImg").click(function () {
      popupmodal.style.display = "block";
      document.body.style.overflow = "hidden";
      var popupnewSrc = this.src;
      popupmodalImg.attr("src", popupnewSrc);
    });

    // Get the <span> element that closes the modal
    var popupspan = document.getElementsByClassName("close-button")[0];

    // When the user clicks on <span> (x), close the modal
    if (popupspan || popupspan != undefined) {
      popupspan.addEventListener("click", function () {
        popupmodal.style.display = "none";
        document.body.style.overflow = "auto";
      });
    }

    const arabic: RegExp = /[\u0600-\u06FF]/;

    if (this.publicationBean.publClass) {
      this.pubclass = this.publicationBean.publClass;
      this.pubbg = true;
    }

    var pub_txt;
    if (this.publicationBean.isShared) {
      pub_txt = this.publicationBean.publText;
    } else {
      pub_txt = this.publicationBean.publText;
    }
    if (pub_txt !== null && pub_txt.length) {
      this.arabicText = arabic.test(pub_txt[0]);
      //console.log("arabic text!");
    }

    var txt = this.publicationBean.publText;

    txt = this.publicationTextService.addUrls(txt);
    let dividedText = this.publicationTextService.divideText(txt);
    this.firstPubText = dividedText.firstPart;
    this.lastPubText = dividedText.lastPart;
    this.isLongText = dividedText.isLongText;


    //onsole.log(this.publicationBean);

    this.changeDetector.markForCheck();
    if (this.publicationBean.publExternalLink) {
      this.linkAPI();
    }
    this.emojiHoverId = "emoji-hover-" + this.publicationBean._id;
    this.pubImgId = "img" + this.publicationBean._id;
    this.commentTextareaId = "comment-" + this.publicationBean._id;
    this.changeDetector.markForCheck();
    if (this.publicationBean) {
      //console.log(this.publicationBean._id);
      this.pubLink = urlEncode(
        environment.SERVER_URL + "main/post/" + this.publicationBean._id
      );
      this.shareLink =
        "https://www.facebook.com/sharer/sharer.php?u=" +
        this.pubLink +
        "&amp;src=sdkpreparse";

      this.nbDisplayedComments = this.publicationBean.comments.length;

      //Youtube Loading
      if (this.publicationBean.publyoutubeLink) {
        this.linkYtb =
          "https://www.youtube.com/embed/" +
          this.publicationBean.publyoutubeLink;
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.linkYtb);
      } else if (this.publicationBean.publfacebookLink) {
        this.linkFb =
          "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F" +
          this.publicationBean.publfacebookLink +
          "%2F&show_text=0&height=580&appId";
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.linkFb);
      } else {
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl("");
      }
      jQuery(document).click(function (e) {
        if (
          jQuery(e.target).closest(".sub-menu").length === 0 &&
          jQuery(e.target).closest(".dots").length === 0
        ) {
          closeSignal();
        }
        if (
          jQuery(e.target).closest(".emoji-hover").length === 0 &&
          jQuery(e.target).closest(".toggleEmoji").length === 0
        ) {
          // this.emojiToggleActive = false;
          closeEmoji();
        }
      });
      jQuery(".textarea").keydown(function (e) {
        if (e.keyCode == 13 && !e.shiftKey) {
          e.preventDefault();
        }
      });
    }
    var publishCommentWithEnter = function () {
      alert(this.publicationBean._id);
    }.bind(this);
    var loadChanges = function () {
      this.changeDetector.markForCheck();
    }.bind(this);

    var closeEmoji = function () {
      jQuery("#" + this.emojiHoverId).hide();
      this.changeDetector.markForCheck();
    }.bind(this);
    var closeSignal = function () {
      this.signalButton = false;
      this.changeDetector.markForCheck();
    }.bind(this);

    this.initComments();
  }

  checkEnter(event) { }

  publishComment() {
    var txt: string = this.commentInputHtml;
    txt = txt
      .replace(/(\&nbsp;|\ )+/g, " ")
      .replace(/(\<.?br\>)+/g, "<br>")
      .replace(/^\<.?br\>|\<.?br\>$/g, "")
      .replace(/(\<div\>\<br\>\<\/div\>)/g, "");
    var white_space_regex: RegExp = /^(\ |\&nbsp;|\<br\>)*$/g;
    var white_space_only = white_space_regex.test(txt);
    if (!commentToSend && white_space_only && !this.uploadedPictureComment) {
      return;
    }

    var commentToSend = this.emojiService.getCommentTextFromHtml(txt);

    this.loadingComment = true;
    this.changeDetector.markForCheck();
    var data = new FormData();

    data.append("commentText", commentToSend);
    data.append("profileId", this.user._id);
    data.append("publId", this.publicationBean._id);
    data.append("commentPicture", this.uploadedPictureComment);
    this.changeDetector.markForCheck();

    this.http
      .post(
        environment.SERVER_URL + pathUtils.ADD_COMMENT,
        data,
        AppSettings.OPTIONS_POST
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          this.changeDetector.markForCheck();
          if (response.status == "0") {
            if (response.comment) {
              if (!this.publicationBean.comments.length)
                this.publicationBean.comments.unshift(response.comment);

              this.listComments.unshift(response.comment);
              this.nbDisplayedComments++;
              //this.formComment.controls.pubComment.updateValue('');
              this.changeDetector.markForCheck();
              this.commentInputHtml = "";
              jQuery("#" + this.commentTextareaId).empty();
              jQuery("#" + this.pubImgId).attr("src", "");
              jQuery("#" + this.pubImgId).hide();
              this.uploadedPictureComment = null;
              this.loadingComment = false;
              if (window.matchMedia("(max-width: 768px)").matches) {
                this.myComments.unshift(response.comment);
              }
            }
          } else {
            console.error(response);
            this.loadingComment = false;
          }
        },
        err => { },
        () => { }
      );
  }

  //uploading Photo click event
  addPhoto() {
    jQuery("." + this.pubImgId).click();
  }

  //uploading photo or GIF
  uploadPhoto($event) {
    var inputValue = $event.target;
    if (inputValue != null && null != inputValue.files[0]) {
      this.uploadedPictureComment = inputValue.files[0];
      this.ng2ImgMaxService
        .compress([this.uploadedPictureComment], 0.5)
        .subscribe(compressedImage => {
          this.ng2ImgMaxService
            .resize([compressedImage], 360, 200)
            .subscribe(result => {
              this.uploadedPictureComment = result;
              previewFile(this.uploadedPictureComment, this.pubImgId);
            });
        });
    } else {
      this.uploadedPictureComment = null;
    }
  }

  resetCommentPicture() {
    jQuery("#" + this.pubImgId).attr("src", "");
    jQuery("#" + this.pubImgId).hide();
    this.uploadedPictureComment = null;
  }

  sharePub(post: PublicationBean) {
    document.body.style.overflow = "hidden";
    swal({
      title: this.translateCode("publication_popup_confirmation_title"),
      text: this.translateCode("publication_popup_confirmation_share_text"),
      showCancelButton: true,
      confirmButtonColor: "#6bac6f",
      confirmButtonText: this.translateCode("publication_popup_YES"),
      cancelButtonText: this.translateCode("publication_popup_NO"),
      cancelButtonColor: "#999",
      allowOutsideClick: true
    }).then(
      function () {
        swal({
          title: this.translateCode(
            "publication_popup_notification_share_title"
          ),
          text: this.translateCode("publication_popup_notification_share_text"),
          type: "success",
          timer: 1000,
          showConfirmButton: false
        }).then(function () { }, function (dismiss) { });
        this.doSharePub(post);
        document.body.style.overflow = "auto";
      }.bind(this),
      function (dismiss) {
        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        if (dismiss === "overlay") {
        }
        document.body.style.overflow = "auto";
      }
    );
  }

  doSharePub(post) {
    var pubId;
    var alreadySharedPubId;
    if (post.isShared) {
      pubId = post.originalPublicationId;
      alreadySharedPubId = this.publicationBean._id;
    } else {
      pubId = this.publicationBean._id;
    }
    let body = JSON.stringify({
      publId: pubId,
      alreadySharedPubId: alreadySharedPubId,
      profileId: this.user._id
    });
    this.http
      .post(
        environment.SERVER_URL + pathUtils.SHARE_PUBLICATION,
        body,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response) {
            if ((response.status = "0")) {
              var element: PublicationBean = response.publication;
              this.postService.putNewPub(element, true);
              this.changeDetector.markForCheck();
            }
          }
        },
        err => { },
        () => { }
      );
  }

  reportPub(post: PublicationBean) {
    swal({
      title: this.translateCode("publication_popup_report_title"),
      text: this.translateCode("publication_popup_report_text"),
      showCancelButton: true,
      cancelButtonColor: "#999",
      confirmButtonColor: "#6bac6f",
      confirmButtonText: this.translateCode("publication_popup_confirm"),
      cancelButtonText: this.translateCode("publication_popup_cancel_button"),
      input: "textarea"
    }).then(
      function (text) {
        if (text) {
          this.doReportPub(text);
          swal({
            title: this.translateCode(
              "publication_popup_notification_report_title"
            ),
            text: this.translateCode(
              "publication_popup_notification_report_text"
            ),
            type: "success",
            timer: 1000,
            showConfirmButton: false
          }).then(function () { }, function (dismiss) { });
          this.changeDetector.markForCheck();
        }
      }.bind(this),
      function (dismiss) {
        if (dismiss === "overlay") {
        }
      }
    );
    this.closeModalPub();
    this.unsubscribe(post);
  }

  doReportPub(text) {
    let body = JSON.stringify({
      signalText: text,
      publId: this.publicationBean._id,
      profileId: this.user._id
    });
    this.http
      .post(
        environment.SERVER_URL + pathUtils.REPORT_PUBLICATION,
        body,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(response => { }, err => { }, () => { });
  }

  loadMoreComments(i: number) {
    var j = ++this.i;






    if (this.allListComments.length - 3 * j < 1) {
      this.listComments = this.allListComments.slice(
        0,
        this.allListComments.length
      );
      this.afficheMoreComments = false;
      this.changeDetector.markForCheck();
    } else {
      this.listComments = this.allListComments.slice(0, 3 * j);

      this.afficheMoreComments = true;
      this.changeDetector.markForCheck();
    }
  }

  // loadMoreComments(i: number) {

  //   this.afficheCommentsLoading = true;
  //   this.afficheMoreComments = false;
  //   if (i >= this.publicationBean.comments.length) {
  //     this.afficheCommentsLoading = false;
  //     this.afficheMoreComments = true;
  //     this.changeDetector.markForCheck();
  //   }
  //   // else if ((this.listComments.length) >= this.publicationBean.comments.length) {
  //   //   this.afficheCommentsLoading = false;
  //   //   this.afficheMoreComments = false;
  //   //   this.changeDetector.markForCheck();
  //   // }
  //   else {
  //     i+=3;

  //     setTimeout(() => {
  //       if(!this.listComments.includes(this.publicationBean.comments[i+this.nbComments]))
  //       for(let j =i;i<this.nbMaxAddComments+i;j++)
  //       this.listComments.push(this.publicationBean.comments[i]);
  //       this.changeDetector.markForCheck();
  //       this.loadMoreComments(i);
  //     }, 0);
  //   }
  // }

  public activateSignal() {
    this.signalButton = !this.signalButton;
  }
  //setTimeout(updateClock, 1000);
  // updatePublicationTime(publishDateString: string): string {
  //   return setTimeout( this.getPublicationTime(publishDateString), 10000);
  // }

  getPublicationTime(publishDateString: string): string {
    //console.log("after 10 seconds"+publishDateString);
    if (this.isFixedPublishDate) return this.fixedPublishDate;
    let date = new Date();
    let currentDate = new Date(
      date.valueOf() + date.getTimezoneOffset() * 60000
    );
    let publishDate = this.dateService.convertIsoToDate(publishDateString);

    let diffDate = this.dateService.getdiffDate(publishDate, currentDate);
    if (diffDate.day > 28) {
      this.fixedPublishDate = this.dateService.convertPublishDate(publishDate);
      this.isFixedPublishDate = true;
    } else if (diffDate.day && diffDate.day == 1) {
      this.fixedPublishDate = this.translateCode("prefix_date_yesterday");
      //this.isFixedPublishDate = true;
    } else if (diffDate.day > 0) {
      this.fixedPublishDate =
        diffDate.day + this.translateCode("prefix_date_days");
      //this.isFixedPublishDate = true;
    } else if (diffDate.hour && diffDate.hour == 1) {
      this.fixedPublishDate = this.translateCode("prefix_date_one_hour");
      this.isFixedPublishDate = true;
    } else if (diffDate.hour && diffDate.hour > 0) {
      this.fixedPublishDate =
        diffDate.hour + this.translateCode("prefix_date_hours");
      this.isFixedPublishDate = true;
    } else if (diffDate.min && diffDate.min > 1)
      this.fixedPublishDate =
        diffDate.min + this.translateCode("prefix_date_minutes");
    else this.fixedPublishDate = this.translateCode("prefix_date_now");

    //setTimeout(this.getPublicationTime(publishDateString), 10000);
    return this.fixedPublishDate;
  }

  addOrRemoveLike() {
    if (!this.publicationBean.isLiked) {
      if (this.publicationBean.nbLikes + this.publicationBean.nbDislikes == 0) {
        this.addLike();
        this.publicationBean.nbLikes = 0;
        this.publicationBean.nbDislikes = 0;
      } else {
        this.addLike();
      }
    } else this.removeLike();
    if (this.publicationBean.nbLikes + this.publicationBean.nbDislikes < 0) {
      this.publicationBean.nbLikes = 0;
      this.publicationBean.nbDislikes = 0;
    }
  }

  addLike() {
    if (this.publicationBean.isDisliked) this.removeDislike();
    let body = JSON.stringify({
      publId: this.publicationBean._id,
      profileId: this.user._id,
      profilefirstname: this.user.firstName,
      profilelastname: this.user.lastName,
      profilepicture: this.user.profilePictureMin
    });

    //console.log(this.publicationBean._id);

    this.http
      .post(
        environment.SERVER_URL + pathUtils.LIKE_PUBLICATION,
        body,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(response => { }, err => { }, () => { });

    this.publicationBean.isLiked = true;
    this.publicationBean.nbLikes++;
  }

  removeLike() {
    let body = JSON.stringify({
      publId: this.publicationBean._id,
      profileId: this.user._id
    });
    this.http
      .post(
        environment.SERVER_URL + pathUtils.REMOVE_LIKE_PUBLICATION,
        body,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(response => { }, err => { }, () => { });

    this.publicationBean.isLiked = false;
    this.publicationBean.nbLikes--;
  }

  addOrRemoveDislike() {
    if (!this.publicationBean.isDisliked) {
      if (this.publicationBean.nbLikes + this.publicationBean.nbDislikes == 0) {
        this.addDislike();
        this.publicationBean.nbLikes = 0;
        this.publicationBean.nbDislikes = 0;
      } else {
        this.addDislike();
      }
    } else this.removeDislike();
    if (this.publicationBean.nbLikes + this.publicationBean.nbDislikes < 0) {
      this.publicationBean.nbLikes = 0;
      this.publicationBean.nbDislikes = 0;
    }
  }

  addDislike() {
    if (this.publicationBean.isLiked) this.removeLike();

    let body = JSON.stringify({
      publId: this.publicationBean._id,
      profileId: this.user._id,
      profilefirstname: this.user.firstName,
      profilelastname: this.user.lastName,
      profilepicture: this.user.profilePictureMin
    });
    this.http
      .post(
        environment.SERVER_URL + pathUtils.DISLIKE_PUBLICATION,
        body,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(response => { }, err => { }, () => { });

    this.publicationBean.isDisliked = true;
    this.publicationBean.nbDislikes++;
  }

  removeDislike() {
    let body = JSON.stringify({
      publId: this.publicationBean._id,
      profileId: this.user._id
    });
    this.http
      .post(
        environment.SERVER_URL + pathUtils.REMOVE_DISLIKE_PUBLICATION,
        body,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(response => { }, err => { }, () => { });
    this.publicationBean.isDisliked = false;
    this.publicationBean.nbDislikes--;
  }

  public toggleEmoji() {
    jQuery("#" + this.emojiHoverId).toggle();
  }

  public closeModalEmoji() {
    jQuery("#" + this.emojiHoverId).hide();
  }

  openModalPub() {
    this.modalPub = true;
    document.body.style.overflow = "hidden";
  }

  closeModalPub() {
    this.modalPub = false;
    document.body.style.overflow = "auto";
  }

  changeEmojiTab(tab) {
    this.selectedEmojiTab = tab;
  }
  
  addToComment(emoji) {
    this.commentInputHtml += this.afficheComment(" " + emoji.shortcut);
  }

  afficheComment(comment): string {
    var img =
      '<img class="emoji" style="align:absmiddle; top : 0;" src="assets/images/basic/';
    for (var i = 0; i < this.listEmoji.length; i++) {
      for (var j = 0; j < this.listEmoji[i].list.length; j++) {
        comment = this.replaceAll(
          comment,
          this.listEmoji[i].list[j].shortcut,
          img + this.listEmoji[i].list[j].imageName + '.png" />'
        );
      }
    }
    return comment;
  }

  replaceAll(comment, search, replacement) {
    return comment.split(search).join(replacement);
  }

  affichePostText(postText: string): string {
    return this.emojiService.AfficheWithEmoji(postText);
  }

  activateAnimation() {
    this.likeAnimation = true;
  }

  deactivateAnimation() {
    this.likeAnimation = false;
  }
  preventLink(e, isGif) {
    if (isGif) {
      e.preventDefault();
    }
  }

  linkAPI() {
    var linkURL = this.publicationBean.publExternalLink;
    if (linkURL.search(".gif") >= 0) {
      var checker = linkURL.substr(linkURL.length - 8, 8);
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

    this.http
      .get(
        environment.SERVER_URL + pathUtils.GET_OPEN_GRAPH_DATA + linkURL,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.results.success) {
            this.link.url = linkURL;
            this.link.title = response.results.data.ogTitle;
            this.link.description = response.results.data.ogDescription;
            if (response.results.data.ogImage) {
              var a = response.results.data.ogImage.url;
              this.link.image = response.results.data.ogImage.url;
              this.link.imageWidth = response.results.data.ogImage.width;
              this.link.imageHeight = response.results.data.ogImage.height;
              if (a.substring(a.length - 3, a.length) == "gif")
                this.link.isGif = true;
              else this.link.isGif = false;
            } else {
              this.link.image = null;
              this.link.imageWidth = 0;
              this.link.imageHeight = 0;
            }
            this.link.isSet = true;

            this.changeDetector.markForCheck();
          } else {
            console.error("error in link API; " + linkURL);
          }
        },
        err => {
          //error
          console.error("error in link API; " + linkURL);
        },
        () => {
          //final
        }
      );
  }

  translateCode(code) {
    let message;
    this.translate.get(code).subscribe((resTranslate: string) => {
      message = resTranslate;
    });
    return message;
  }

  shortNumber(n: number): string {
    return n < 1000 ? n + "" : (n / 1000 + "k").replace(".", ",");
  }

}

function urlEncode(source: string): string {
  source = replaceAllNew(source, ":", "%3A");
  source = replaceAllNew(source, "/", "%2F");
  source = replaceAllNew(source, "#", "%23");

  return source;
}
function replaceAllNew(comment, search, replacement) {
  return comment.split(search).join(replacement);
}
function previewFile(uploadedFile, elementId) {
  var preview = jQuery("#preview-image");
  var file = uploadedFile;
  var reader = new FileReader();

  reader.addEventListener(
    "load",
    function () {
      //preview.att.src = reader.result;

      jQuery("#" + elementId).attr("src", reader.result);
      jQuery("#" + elementId).fadeIn(500);
      //console.log(reader.result);
      //test
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
  }
}
