import 'rxjs/add/operator/map';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { User } from '../../../beans/user';
import { LoginService } from '../../../login/services/loginService';

declare var jQuery: any;


@Component({
  moduleId: module.id,
    selector: 'parameters',
    templateUrl: 'parameters.html',
    changeDetection: ChangeDetectionStrategy.OnPush

})


export class Parameters {
    public user: User = new User();
	public page;
    constructor(public translate:TranslateService, private title:Title,private route: ActivatedRoute,private http:Http,
                private router:Router, public loginService:LoginService,private changeDetector: ChangeDetectorRef) {
        this.title.setTitle("Modifier profile - Speegar");
		if (loginService.isConnected()) {
            loginService.actualize();
            this.user = loginService.user
        }
        else {
            this.router.navigate(['/login/sign-in']);
        }
    }


}



