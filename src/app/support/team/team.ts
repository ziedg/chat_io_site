import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';



/* conf */
import {AppSettings} from '../../conf/app-settings';

/* beans */
import {NotFound} from "../../main/notFound/not-found";
import {Title} from "@angular/platform-browser";



declare var jQuery: any;


@Component({
  moduleId: module.id,
    selector: 'team',
    templateUrl: 'team.html',
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class Team {

    constructor(private title:Title,private route: ActivatedRoute,private http:Http, private router:Router) {
        this.title.setTitle("L'equipe");


    }


}



