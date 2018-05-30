import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';



declare var jQuery: any;


@Component({
  moduleId: module.id,
    selector: 'cgu',
    templateUrl: 'cgu.html',
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class Cgu {

    constructor(private title:Title,private route: ActivatedRoute,private http:Http, private router:Router) {
        this.title.setTitle("Conditions générales d'utilisation");

    }


}



