import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy, Output, EventEmitter } from "@angular/core";import { environment } from 'environments/environment';
import { Http, Response } from '@angular/http';
import { MinifiedUser } from "../../../../beans/Minified-user";
import { CommentBean } from "../../../../beans/comment-bean";
import { AppSettings } from "../../../../shared/conf/app-settings";
import * as pathUtils from "../../../../utils/path.utils";



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

    @Output("closeModal") eventCloseModal = new EventEmitter()


    @Input("pubId") pubId: string;
    @Input("nbLikes") nbLikes: number;
    @Input("nbDislikes") nbDislikes: number;

    constructor(private http: Http,
                private changeDetector: ChangeDetectorRef,) {
    }

    ngOnInit() {
        console.log("opent interaction modal", this.pubId);
        document.body.style.overflow = "hidden";
        this.getInteractions();
    }

    ngOnDestroy() {
        document.body.style.overflow = "auto";
    }

    getInteractions() {
        console.log("getInteractions");
        var url: string =
          environment.SERVER_URL + pathUtils.GET_SOCIAL_INTERACTIONS;
    
        let body = JSON.stringify({
          publId: this.pubId,
          page: this.interactionsPage
        });
    
        this.http
          .post(url, body, AppSettings.OPTIONS)
          .map((res: Response) => res.json())
          .subscribe(
            response => {
              this.interactionsLoaded=true;
              this.InteractionsLikes = response.message.likes.slice();
              this.InteractionsDislikes = response.message.dislikes.slice();
              console.log(this.InteractionsLikes);
              console.log(this.InteractionsDislikes);
            },
            err => { 
              this.interactionsLoaded=true;
            },
            () => {
              this.changeDetector.markForCheck();
            }
        );
    }


    closeModalInteractions() {
        if(this.interactionsLoaded) this.eventCloseModal.emit();
    }



}