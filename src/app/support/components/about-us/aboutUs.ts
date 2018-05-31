import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

declare var jQuery: any;


@Component({
  moduleId: module.id,
    selector: 'about-us',
    templateUrl: 'aboutUs.html',
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class AboutUs {

    constructor(private title:Title,private route: ActivatedRoute,private http:Http, private router:Router) {
         this.title.setTitle("A propos de nous");

    }


}



