import {Component, ChangeDetectorRef} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {TopBlagueursAndDecov} from '../../topBlagueursAndDecov/topBlagueursAndDecov';

import {Publication } from '../../publication/publication';
import {Comment} from '../../comment/comment';

/* conf */
import {AppSettings} from '../../conf/app-settings';

/* services */
import {LoginService} from '../../service/loginService';

/* user  */
import {User} from '../../beans/user';

/* beans */
import {PublicationBean} from '../../beans/publication-bean';
import {NotFound} from "../notFound/not-found";
import {Title} from "@angular/platform-browser";

import {Offline} from '../../offline/offline';
import {Online} from '../../online/online';

declare var jQuery: any;


@Component({
  moduleId: module.id,
    selector: 'post',
    templateUrl: 'post.html'
})


export class Post {

    public publicationBeanList: Array<PublicationBean> = [];
    public user: User = new User();
    public postDisplayed;
    public isVisitor:boolean;
    private wrongPost: boolean = false;
    public postId;

    userParm;
    lastRouterPostId;

    constructor(private title:Title,private route: ActivatedRoute,private http:Http, private router:Router, private loginService:LoginService,private changeDetector: ChangeDetectorRef) {

        this.changeDetector.markForCheck();
        if(this.loginService.isVisitor()){
            this.isVisitor=true;
        }
        else {
            this.isVisitor=false;
        }
        this.router.events.subscribe(route => {
            if(this.route.snapshot.params['id']!=this.lastRouterPostId) {
                this.lastRouterPostId=this.route.snapshot.params['id'];
                this.postId=this.route.snapshot.params['id'];
                this.changeDetector.markForCheck();
            }
    });
    }






}



