import 'rxjs/add/operator/map';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Http, Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { Router } from "@angular/router";
import { environment } from '../../../../environments/environment';
import { CommentBean } from '../../../beans/comment-bean';
import { EmojiListBean } from '../../../beans/emoji-list-bean';
import { PublicationBean } from '../../../beans/publication-bean';
import { User } from '../../../beans/user';
import { LoginService } from '../../../login/services/loginService';
import { AppSettings } from '../../../shared/conf/app-settings';
import * as pathUtils from '../../../utils/path.utils';
import { DateService } from '../../services/dateService';
import { EmojiService } from '../../services/emojiService';
import { PublicationTextService } from '../../services/publicationText.service';

declare var swal: any;

@Component({
  moduleId: module.id,
  selector: 'comment',
  inputs: ['commentBean', 'publicationBean'],
  templateUrl: 'comment.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Comment {
  @Input() nbDisplayedComments;
  @Output() nbDisplayedCommentsChange = new EventEmitter();
  commentBean: CommentBean = new CommentBean();
  publicationBean: PublicationBean = new PublicationBean();
  user: User;
  listEmoji: Array<EmojiListBean> = [];
  public InteractionsLikes: Array<User> = [];
  public InteractionsDislikes: Array<User> = [];
  private isFixedPublishDate: boolean = false;
  private fixedPublishDate: string

  imageBaseUrl = environment.IMAGE_BASE_URL;
  commentText: string;
  commentTextLastPart: string = "";
  isLongComment: boolean = false;
  showLastPart: boolean = false;
  showButtons: boolean = false;

  constructor(public translate: TranslateService,
              private http: Http,
              private router: Router,
              private dateService: DateService,
              private loginService: LoginService,
              public emojiService: EmojiService,
              private changeDetector: ChangeDetectorRef,
              private publicationTextService: PublicationTextService) {
    loginService.actualize();
    this.user = loginService.user;
    this.listEmoji = emojiService.getEmojiList();
  }

  ngOnInit() {
    if (this.router.routerState.snapshot.url.includes('post')) {
      this.showButtons = true;
    }
    this.commentText = this.removeWhiteSpaceComment(this.commentBean.commentText);
    if(this.commentText) {
      this.commentText = this.emojiService.AfficheWithEmoji(this.commentText);
      let dividedText = this.publicationTextService.divideText(this.commentText);
      this.commentText = dividedText.firstPart;
      this.commentTextLastPart = dividedText.lastPart;
      this.isLongComment = dividedText.isLongText;
    }
  }

  addOrRemoveLike() {
    if (!this.commentBean.isLiked)
      this.addLike();
    else
      this.removeLike();
  }

  removeWhiteSpaceComment(comment): string {
    let white_space_regex: RegExp = /^(\ |\&nbsp;|\<br\>)*$/g;
    return white_space_regex.test(comment) ? '' : comment;
  }

  addOrRemoveDislike() {
    if (!this.commentBean.isDisliked)
      this.addDislike();
    else
      this.removeDislike();
  }

  addLike() {
    if (this.commentBean.isDisliked)
      this.removeDislike();

    let body = JSON.stringify({
      publId: this.commentBean.publId,
      commentId: this.commentBean._id,
      profileId: this.user._id
    });

    this.http.post(
      environment.SERVER_URL + pathUtils.LIKE_COMMENT,
      body,
      AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
        },
        err => {
        },
        () => {
        }
      );
    this.commentBean.isLiked = true;
    this.commentBean.nbLikes++;
  }
  addDislike() {
    if (this.commentBean.isLiked)
      this.removeLike();

    let body = JSON.stringify({
      publId: this.commentBean.publId,
      commentId: this.commentBean._id,
      profileId: this.user._id
    });

    this.http.post(
      environment.SERVER_URL + pathUtils.DISLIKE_COMMENT,
      body,
      AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {

        },
        err => {
        },
        () => {
        }
      );

    this.commentBean.isDisliked = true;
    this.commentBean.nbDislikes++;
  }
  getCommentTime(publishDateString: string): string {
    if (this.isFixedPublishDate)
      return this.fixedPublishDate;
    let date = new Date();
    let currentDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
    let publishDate = this.dateService.convertIsoToDate(publishDateString);

    let diffDate = this.dateService.getdiffDate(publishDate, currentDate);
    if (diffDate.day > 28) {
      this.fixedPublishDate = this.dateService.convertPublishDate(publishDate);
      this.isFixedPublishDate = true;
    }
    else if (diffDate.day && diffDate.day == 1) {
      this.fixedPublishDate = this.translateCode("prefix_date_yesterday");
      this.isFixedPublishDate = true;
    }
    else if (diffDate.day > 0) {
      this.fixedPublishDate = diffDate.day + this.translateCode("prefix_date_days");
      this.isFixedPublishDate = true;
    }
    else if ((diffDate.hour) && (diffDate.hour == 1)) {
      this.fixedPublishDate = this.translateCode("prefix_date_one_hour");
      this.isFixedPublishDate = true;
    }
    else if ((diffDate.hour) && (diffDate.hour > 0)) {
      this.fixedPublishDate = diffDate.hour + this.translateCode("prefix_date_hours");
      this.isFixedPublishDate = true;
    }
    else if ((diffDate.min) && (diffDate.min > 1))
      this.fixedPublishDate = diffDate.min + this.translateCode("prefix_date_minutes");
    else
      this.fixedPublishDate = this.translateCode("prefix_date_now");
    return this.fixedPublishDate;
  }

  removeLike() {
    let body = JSON.stringify({
      publId: this.commentBean.publId,
      commentId: this.commentBean._id,
      profileId: this.user._id
    });

    this.http.post(
      environment.SERVER_URL + pathUtils.REMOVE_LIKE_COMMENT,
      body,
      AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {

        },
        err => {
        },
        () => {
        }
      );
    this.commentBean.isLiked = false;
    this.commentBean.nbLikes--;
  }
  removeDislike() {
    let body = JSON.stringify({
      publId: this.commentBean.publId,
      commentId: this.commentBean._id,
      profileId: this.user._id
    });

    this.http.post(
      environment.SERVER_URL + pathUtils.REMOVE_DISLIKE_COMMENT,
      body,
      AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
        },
        err => {
        },
        () => {
        }
      );
    this.commentBean.isDisliked = false;
    this.commentBean.nbDislikes--;
  }


  removeComment(comment: CommentBean) {
    if (this.user._id == comment.profileId
      || this.publicationBean.profileId == this.user._id) {
      swal({
        cancelButtonColor: '#999',
        title: this.translateCode("comment_popup_confirmation_delete_title"),
        text: this.translateCode("comment_popup_confirmation_delete_text"),
        showCancelButton: true,
        confirmButtonColor: "#12A012",
        confirmButtonText: this.translateCode("comment_popup_confirmation_delete_button"),
        cancelButtonText: this.translateCode("comment_popup_cancel_delete_button"),
        allowOutsideClick: true
      }).then(function () {
        this.doDeleteComment();
        swal({
          title: this.translateCode("comment_popup_notification_delete_title"),
          text: this.translateCode("comment_popup_notification_delete_text"),
          type: "success",
          timer: 1000,
          showConfirmButton: false
        }).then(function () {
        }, function (dismiss) {
        });
        this.changeDetector.markForCheck();
      }.bind(this),
        function (dismiss) {
          if (dismiss === 'overlay') {

          }
        }
      );
    }
  }

  doDeleteComment() {
    this.commentBean.deleted = true;
    this.nbDisplayedComments--;
    this.nbDisplayedCommentsChange.emit(this.nbDisplayedComments);
    this.changeDetector.markForCheck();
    let body = JSON.stringify({
      publId: this.commentBean.publId,
      commentId: this.commentBean._id
    });
    this.http.post(environment.SERVER_URL + pathUtils.REMOVE_COMMENT,
      body,
      AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
        },
        err => {
        },
        () => {
          this.changeDetector.markForCheck();
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
}
