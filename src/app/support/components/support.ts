import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../beans/user';
import { LoginService } from '../../login/services/loginService';

declare var jQuery: any;


@Component({
  moduleId: module.id,
    selector: 'support',
    templateUrl: 'support.html',
    changeDetection: ChangeDetectionStrategy.OnPush

})


export class Support {
    public user: User = new User();
    isConnected = false;
    currentLocation:string;
    constructor(private _loc:Location,private title: Title, private route: ActivatedRoute, private http: Http, private router: Router, private loginService: LoginService, private changeDetector: ChangeDetectorRef) {
        if (loginService.isConnected()) {
            loginService.actualize();
            this.user = loginService.user
            this.isConnected = true;
        }
        else {
            this.isConnected = false;
        }
    }
    ngOnInit()
    {
        this.currentLocation=this._loc.path();
        if(this.currentLocation == "/support/about-us")
        {
             jQuery("#aboutUsTab").show();
        }
        if(this.currentLocation == "/support/cgu")
        {
             jQuery("#cguTab").show();
        }
        if(this.currentLocation == "/support/team")
        {
             jQuery("#teamTab").show();
        }
    }
    collapse(a:number) {
        jQuery(".support-mobile-tab").hide();

        switch(a)
        {
            case 0: jQuery("#aboutUsTab").slideDown(500); break;
            case 1: jQuery("#cguTab").slideDown(500); break;
            case 2: jQuery("#teamTab").slideDown(500); break;
        }
    }
}



