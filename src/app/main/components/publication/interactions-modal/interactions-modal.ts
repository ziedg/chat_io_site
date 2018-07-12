import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy, Output, EventEmitter } from "@angular/core";import { environment } from 'environments/environment';
import { Http, Response } from '@angular/http';
import { MinifiedUser } from "../../../../beans/Minified-user";
import { CommentBean } from "../../../../beans/comment-bean";
import { AppSettings } from "../../../../shared/conf/app-settings";
import * as pathUtils from "../../../../utils/path.utils";
import { User } from "../../../../beans/user";
import { LoginService } from "../../../../login/services/loginService";



@Component({
  selector: 'interactions-modal',
  templateUrl: './interactions-modal.html',
  styleUrls: ['./interactions-modal.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class InteractiosModal implements OnInit, OnDestroy {
    public InteractionsLikes: Array<MinifiedUser> = [];
    public InteractionsDislikes: Array<MinifiedUser> = [];
    displayedNumberInteractions = 10;
    interactionsPage = 0;
    public modalInteractions = false;
    interactionsLoaded:boolean=false;
    imageBaseUrl = environment.IMAGE_BASE_URL;
    profileId:string;

    isTogglingSubscribe: boolean = true;

    @Output("closeModal") eventCloseModal = new EventEmitter()

    @Input("pubId") pubId: string;
    @Input("user") user: User;
    @Input("nbLikes") nbLikes: number;
    @Input("nbDislikes") nbDislikes: number;

    constructor(private http: Http,
                private changeDetector: ChangeDetectorRef,
                public loginService: LoginService) {
      this.profileId = this.loginService.user._id;
    }

    ngOnInit() {
        document.body.style.overflow = "hidden";
        this.getInteractions();
    }

    getInteractions() {
        var url: string =environment.SERVER_URL + pathUtils.GET_SOCIAL_INTERACTIONS;
    
        let body = JSON.stringify({
          publId: this.pubId,
          page: this.interactionsPage});
    
        this.http
          .post(url, body, AppSettings.OPTIONS)
          .map((res: Response) => res.json())
          .subscribe(
            response => {
              this.interactionsLoaded=true;
              this.InteractionsLikes = response.message.likes.slice();
              this.InteractionsDislikes = response.message.dislikes.slice();
            },
            err => { 
              this.interactionsLoaded=true;
            },
            () => {
              this.changeDetector.markForCheck();
            }
        );
    }

    openTab(tabName) {
        var i, tabcontent, tablinks;
        if (tabName === "Likes") {
          document.getElementById("nulle").style.borderBottom = "none";
          document.getElementById("lol").style.borderBottom = "1px solid #2aaa2a";
        } else if (tabName === "Dislikes") {
          document.getElementById("lol").style.borderBottom = "none";
          document.getElementById("nulle").style.borderBottom = "1px solid #fb001e";
        }
    
        tabcontent = document.getElementsByClassName("interactions-tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("interactions-tablinks");
        for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        var currentelem = document.getElementById(tabName);
        currentelem.style.display = "block";
        currentelem.className += " active";
      }
    

      toggleSubscribe(user) {
        this.isTogglingSubscribe = false;
        if (user.isSubscribed === "true") {
          this.unsubscribeUser(user.userId);
          
          let like = this.InteractionsLikes.filter(x => x.userId === user.userId)[0];
          if (like != undefined) { like.isSubscribed = "false"; }
          let dislike = this.InteractionsDislikes.filter(x => x.userId === user.userId)[0];
          if (dislike != undefined) { dislike.isSubscribed = "false";}
        }
        else {
          if (user.isSubscribed === "false") {
            this.subscribeUser(user.userId);
            let like = this.InteractionsLikes.filter(x => x.userId === user.userId)[0];
            if (like != undefined) { like.isSubscribed = "true";}
            let dislike = this.InteractionsDislikes.filter(x => x.userId === user.userId)[0];
            if (dislike != undefined) { dislike.isSubscribed = "true";}
          }
        }
      }

    
      subscribeUser(userId) {
        let body = JSON.stringify({profileId: userId});
    
        this.http
          .post(
            environment.SERVER_URL + pathUtils.SUBSCRIBE,
            body,
            AppSettings.OPTIONS
          )
          .map((res: Response) => res.json())
          .subscribe(
            response => {
              if (response.status == 0) {}
            },
            err => { },
            () => {
              this.changeDetector.markForCheck();
              this.isTogglingSubscribe = true;
            }
          );
      }
    
      unsubscribeUser(userId) {
        let body = JSON.stringify({profileId: userId});
    
        this.http
          .post(
            environment.SERVER_URL + pathUtils.UNSUBSCRIBE,
            body,
            AppSettings.OPTIONS)
          .map((res: Response) => res.json())
          .subscribe(
            response => {
              if (response.status == 0) {
              }
            },
            err => { },
            () => {
              this.changeDetector.markForCheck();
              this.isTogglingSubscribe = true;
            }
          );
      }
    


    closeModalInteractions() {
        if(this.interactionsLoaded && this.isTogglingSubscribe) this.eventCloseModal.emit();
    }

    clickOutside(){
        setTimeout(()=> this.closeModalInteractions(), 10);
    }

    ngOnDestroy() {
        document.body.style.overflow = "auto";
    }
}