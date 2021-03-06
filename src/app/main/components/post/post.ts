import { ChangeDetectorRef, Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { PublicationBean } from '../../../beans/publication-bean';
import { User } from '../../../beans/user';
import { LoginService } from '../../../login/services/loginService';
import { AppSettings } from '../../../shared/conf/app-settings';

declare var jQuery: any;


@Component({
  moduleId: module.id,
    selector: 'post',
    templateUrl: 'post.html'
})


export class Post {
  public hiddenContent: boolean = false;
  public postId;
  public publicationBeanList: Array<PublicationBean> = [];
  public user: User = new User();
  public wrongPost: boolean = false;
	// TODO: check wrongPost access

    constructor(private location: Location,private title:Title,private route: ActivatedRoute,private http:Http, private router:Router, private loginService:LoginService,private changeDetector: ChangeDetectorRef) {
      if (location.path() != '') {
        if (location.path().indexOf('/main/post') != -1) {
          this.hiddenContent = true;
        } else {
          this.hiddenContent = false;
        }
      }
      this.loginService.redirect();
      this.user = this.loginService.getUser();
            this.route.params.subscribe((params)=>{
            this.postId=params['id'];
            this.getPost(this.postId);
            this.changeDetector.markForCheck();
          })
    }


  ngOnInit() {
   
  }

  getPost(postId: string) {
    this.http.get(
      environment.SERVER_URL + 'getPublicationById/' + postId + '?profileID=' + this.user._id, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
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
              jQuery('head').append('<meta property="og:description" content="description online" />');
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
            jQuery('head').append('<meta property="og:url" content="' + environment.SERVER_URL + 'main/post/' + element._id + '" />');

            if (pubTitle == "Speegar")
              this.title.setTitle(pubTitle);
            else
              this.title.setTitle(pubTitle + " - Speegar");
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
  }







}
