import {Component, ChangeDetectorRef} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/map';


import {Publication} from '../publication/publication';
import {Comment} from '../comment/comment';

/* conf */
import {AppSettings} from '../conf/app-settings';

/* services */
import {LoginService} from '../service/loginService';

/* user  */
import {User} from '../beans/user';

/* beans */
import {PublicationBean} from '../beans/publication-bean';
import {NotFound} from "../main/notFound/not-found";
import {Title} from "@angular/platform-browser";
import {environment} from "../../environments/environment";
declare var jQuery: any;

@Component({
  moduleId: module.id,
  selector: 'offline',
  templateUrl: 'offline.html',
  inputs: ['postId'],
})


export class Offline {
  public postId;
  public publicationBeanList: Array<PublicationBean> = [];
  public user: User = new User();
  public postDisplayed: User = new User();
  private wrongPost: boolean = false;


  userParm;
  lastRouterPostId;

  constructor(private title: Title, private route: ActivatedRoute, private http: Http, private router: Router, private loginService: LoginService, private changeDetector: ChangeDetectorRef) {

    this.changeDetector.markForCheck();
    this.user = this.loginService.getVisitor();

  }

  ngOnInit() {
    this.getPost(this.postId);
    this.changeDetector.markForCheck();
  }

  getPost(postId: string) {

    this.http.get(
      environment.SERVER_URL + 'getPublicationById/' + postId + '?profileID=57d71be929d3b42b0d000022', AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          console.log(response);
          if (response.publication) {
            if (response.publication._id == postId) {
              this.publicationBeanList = [];
              var element = response.publication;
              element.displayed = true;
              if (element.isShared == "true") {
                element.isShared = true;
              }
              else {
                element.isShared = false;
              }
              if (element.isLiked == "true")
                element.isLiked = true;
              else
                element.isLiked = false;

              if (element.isDisliked == "true")
                element.isDisliked = true;
              else
                element.isDisliked = false;

              for (var j = 0; j < element.comments.length; j++) {
                if (element.comments[j].isLiked == "true")
                  element.comments[j].isLiked = true;
                else
                  element.comments[j].isLiked = false;

                if (element.comments[j].isDisliked == "true")
                  element.comments[j].isDisliked = true;
                else
                  element.comments[j].isDisliked = false;

                if (j == element.comments.length) {
                  this.publicationBeanList.push(element);

                }
              }
              this.publicationBeanList.push(element);
              this.wrongPost = false;

              var pubTitle = "Speegar";

              if (response.publication.publTitle && response.publication.publTitle != "null")
                pubTitle = response.publication.publTitle;
              else if (response.publication.publText && response.publication.publText != "null")
                pubTitle = response.publication.publText.substr(0, 15);
              else
                pubTitle = "Speegar";


              jQuery("meta[property='og:title']").remove();
              jQuery('head').append('<meta property="og:title" content="' + pubTitle + '" />');


              if (response.publication.publText && response.publication.publText != "null") {
                jQuery("meta[property='og:description']").remove();
                //jQuery('head').append( '<meta property="og:description" content="'+response.publication.publText+'" />' );
                jQuery('head').append('<meta property="og:description" content="description offline" />');

              }

              this.wrongPost = false;
              jQuery("meta[property='og:title']").remove();


              if (element.publPictureLink) {
                jQuery("meta[property='og:image']").remove();
                jQuery('head').append('<meta property="og:image" content="' + environment.IMAGE_BASE_URL + element.publPictureLink + '"/>');

                var tmpImg = new Image();
                tmpImg.src = environment.IMAGE_BASE_URL + element.publPictureLink;
                jQuery(tmpImg).on('load', function () {
                  jQuery("meta[property='og:image:width']").remove();
                  jQuery("meta[property='og:image:height']").remove();
                  jQuery('head').append('<meta property="og:image:width" content="' + tmpImg.width + '" />');
                  jQuery('head').append('<meta property="og:image:height" content="' + tmpImg.height + '" />');

                });
              }
              jQuery("meta[property='og:url']").remove();
              jQuery('head').append('<meta property="og:url" content="' + AppSettings.SITE_URL + 'smain/post/' + element._id + '" />');

              this.changeDetector.markForCheck();
            }
            else {
              this.wrongPost = true;
              this.changeDetector.markForCheck();
            }
          } else {
            this.wrongPost = true;
            this.changeDetector.markForCheck();
          }
        },
        err => {
          this.wrongPost = true;
        },
        () => {
          this.changeDetector.markForCheck();

        }
      );
    console.debug(this.wrongPost.toString());
  }


}



