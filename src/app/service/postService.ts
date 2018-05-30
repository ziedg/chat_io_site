import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { Injectable }     from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

/* conf */
import {AppSettings} from '../conf/app-settings';

/* services */
import {LoginService} from '../login/services/loginService';
import {LinkView} from "../service/linkView";

/* user  */
import {User} from '../beans/user';
/* beans */
import {PublicationBean} from '../beans/publication-bean';
import {Title} from "@angular/platform-browser";
import {environment} from "../../environments/environment";
/* beans */

@Injectable()
export class PostService {
    finPosts: boolean = false;
    public publicationBeanList: Array<PublicationBean> = [];
    public user: User = new User();
    lastPostId: string = "null";
    isLock: boolean = false;
    showErreurConnexion = false;
    showLoading = false;
    errorMsg = "";

    /* constructor  */
    constructor(private linkView:LinkView,private http: Http, private router: Router, private loginService: LoginService,private changeDetector: ChangeDetectorRef){
        this.user = this.loginService.getUser();
        window.scrollTo(0, 0);
        this.publicationBeanList=[];
    }
    putIntoList(response) {
        this.isLock = true;
        var element;
        for (var i = 0; i < response.length; i++) {
            element = response[i];
            element.displayed=true;

            if(response[i].isShared == "true"){
                element.isShared=true;
            }
            else {
                element.isShared=false;
            }

            if (response[i].isLiked == "true")
                element.isLiked = true;
            else
                element.isLiked = false;

            if (response[i].isDisliked == "true")
                element.isDisliked = true;
            else
                element.isDisliked = false;

            for(var j = 0; j < response[i].comments.length; j++) {
                if (response[i].comments[j].isLiked == "true")
                    element.comments[j].isLiked = true;
                else
                    element.comments[j].isLiked = false;

                if (response[i].comments[j].isDisliked == "true")
                    element.comments[j].isDisliked = true;
                else
                    element.comments[j].isDisliked = false;

                if(j == response[i].comments.length) {
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
    putNewPub(pub:PublicationBean,isShared:boolean){
        var element = pub;
        element.displayed=true;
        if(isShared){
            element.isShared=true;
        }
        else {
            element.isShared=false;
        }
        this.publicationBeanList.unshift(element);
        this.changeDetector.markForCheck();
    }
    loadFirstPosts():Array<PublicationBean>{
        if(this.user) {
            var urlAndPara="";
        //localStorage.getItem('typePosts') != 'recent' && localStorage.getItem('typePosts') != 'popular'
         if(localStorage.getItem('typePosts') == 'popular' ) {
             urlAndPara = environment.SERVER_URL + 'getPublicationPopulaireByProfileId/?profileID=' + this.user._id + '&last_publication_id=';
         }
         else {
             urlAndPara = environment.SERVER_URL + 'getPublicationByProfileId/?profileID=' + this.user._id + '&last_publication_id=';
         }
            this.http.get(
                urlAndPara, AppSettings.OPTIONS)
                .map((res: Response) => res.json())
                .subscribe(
                    response => {
                        this.putIntoList(response);
                        this.changeDetector.markForCheck();
                        return this.publicationBeanList;
                    },
                    err => {
                        setTimeout(() => {
                            this.showErreurConnexion = true;
                            this.showLoading = false;
                        }, 3000);
                    },
                    () => {
                        this.isLock = false;
                        return this.publicationBeanList;
                    }
                );
        }
        return this.publicationBeanList;
    }
    //load more Posts
    loadMorePosts():Array<PublicationBean> {
        if(this.user) {
            var urlAndPara="";
            if(localStorage.getItem('typePosts') == 'popular' ) {
                urlAndPara = environment.SERVER_URL + 'getPublicationPopulaireByProfileId/?profileID=' + this.user._id + '&last_publication_id='+ this.lastPostId;
            }
            else {
                urlAndPara = environment.SERVER_URL + 'getPublicationByProfileId/?profileID=' + this.user._id + '&last_publication_id='+ this.lastPostId;
            }
            this.http.get(
                urlAndPara, AppSettings.OPTIONS)
                .map((res: Response) => res.json())
                .subscribe(
                    response => {
                        this.putIntoList(response);
                        this.changeDetector.markForCheck();
                        return this.publicationBeanList;
                    },
                    err => {
                        setTimeout(() => {
                            this.showErreurConnexion = true;
                            this.showLoading = false;
                        }, 3000);
                    },
                    () => {
                        this.isLock = false;
                        return this.publicationBeanList;
                    }
                );
            return this.publicationBeanList;
        }
    }
    checkIsLoked():Boolean{
        return this.isLock;
    }
    isFinPosts():Boolean{
        return this.finPosts;
    }
    letsShowLoading():Boolean{
        return this.showLoading;
    }
    letsShowErreurConnexion():Boolean{
        return this.showErreurConnexion;
    }
    getPostsList():Array<PublicationBean>{
        return this.publicationBeanList;
    }
    getLasPostId():string{
        return this.lastPostId;
    }
    setIsLocked(islocked:boolean){
        this.isLock=islocked;
    }
    setFinPosts(finPosts:boolean){
        this.finPosts=finPosts;
    }
    setShowLoading(showLoading:boolean){
        this.showLoading=showLoading;
    }
    setShowErrorConnexion(showErreurConx:boolean){
        this.showErreurConnexion=showErreurConx;
    }

}
