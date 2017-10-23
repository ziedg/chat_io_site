import {Input, Output, EventEmitter, Component, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {CommentBean} from "../beans/comment-bean";
import {PublicationBean} from "../beans/publication-bean";
import {Response, Http} from "@angular/http";
import {AppSettings} from "../conf/app-settings";
import {LoginService} from "../service/loginService";
import {User} from "../beans/user";
import {EmojiService} from "../service/emojiService";
import {EmojiListBean} from "../beans/emoji-list-bean";
import {DateService} from '../service/dateService';

import 'rxjs/add/operator/map';
import {environment} from "../../environments/environment";


declare var emojify: any;
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
  private isFixedPublishDate: boolean = false;
  private fixedPublishDate: string;

  imageBaseUrl = environment.IMAGE_BASE_URL;

    constructor(private http: Http, private dateService: DateService, private loginService: LoginService, public emojiService: EmojiService, private changeDetector: ChangeDetectorRef) {
    loginService.actualize();
    this.user = loginService.user;
    this.listEmoji = emojiService.getEmojiList();
  }

  ngOnInit() {
  }

  addOrRemoveLike() {
    if (!this.commentBean.isLiked)
      this.addLike();
    else
      this.removeLike();
  }

  afficheComment(comment): string {
    return this.emojiService.AfficheWithEmoji(comment);
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

    this.http.post(environment.SERVER_URL + 'likeComment', body, AppSettings.OPTIONS)
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
      this.fixedPublishDate = "hier";
      this.isFixedPublishDate = true;
    }
    else if (diffDate.day > 0) {
      this.fixedPublishDate = diffDate.day + " jours";
      this.isFixedPublishDate = true;
    }
    else if ((diffDate.hour) && (diffDate.hour == 1)) {
      this.fixedPublishDate = "1 hr";
      this.isFixedPublishDate = true;
    }
    else if ((diffDate.hour) && (diffDate.hour > 0)) {
      this.fixedPublishDate = diffDate.hour + " hrs";
      this.isFixedPublishDate = true;
    }
    else if ((diffDate.min) && (diffDate.min > 1))
      this.fixedPublishDate = diffDate.min + " mins";
    else
      this.fixedPublishDate = "a l’instant";
    return this.fixedPublishDate;
  }

  removeLike() {
    let body = JSON.stringify({
      publId: this.commentBean.publId,
      commentId: this.commentBean._id,
      profileId: this.user._id
    });

    this.http.post(environment.SERVER_URL + 'removeLikeComment', body, AppSettings.OPTIONS)
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

  addDislike() {
    if (this.commentBean.isLiked)
      this.removeLike();

    let body = JSON.stringify({
      publId: this.commentBean.publId,
      commentId: this.commentBean._id,
      profileId: this.user._id
    });

    this.http.post(environment.SERVER_URL + 'dislikeComment', body, AppSettings.OPTIONS)
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

  removeComment(comment: CommentBean) {
    if (this.user) {
      if (this.user._id == comment.profileId || this.publicationBean.profileId == this.user._id) {
        swal({
          cancelButtonColor: '#999',
          title: "Êtes-vous sûr?",
          text: "Vous ne serez pas en mesure de récupérer ce commentaire !",
          showCancelButton: true,
          confirmButtonColor: "#12A012",
          confirmButtonText: "Oui, supprimez-le!",
          allowOutsideClick: true
        }).then(function () {
            this.doDeleteComment();
            swal({
              title: "supprimé !",
              text: "Votre commentaire a été supprimé.",
              type: "success",
              timer: 1000,
              showConfirmButton: false
            }).then(function () {
            }, function (dismiss) {
            });
            this.changeDetector.markForCheck();
          }.bind(this),
          function (dismiss) {
            // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            if (dismiss === 'overlay') {

            }
          }
        );

      }
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
    this.http.post(environment.SERVER_URL + 'removeComment', body, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          this.changeDetector.markForCheck();
        },
        err => {
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );
  }

  removeDislike() {
    let body = JSON.stringify({
      publId: this.commentBean.publId,
      commentId: this.commentBean._id,
      profileId: this.user._id
    });

    this.http.post(environment.SERVER_URL + 'removeDislikeComment', body, AppSettings.OPTIONS)
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


}
