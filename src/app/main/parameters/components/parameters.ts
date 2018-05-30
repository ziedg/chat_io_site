import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';

/* parameters components */
import { EditProfile} from './edit-profile/editProfile'
import { ChangePassword} from './change-password/changePassword'

/* conf */
import {AppSettings} from '../../../shared/conf/app-settings';

/* services */
import {LoginService} from '../../../login/services/loginService';
import {TranslateService} from '@ngx-translate/core';

/* user  */
import {User} from '../../../beans/user';

/* beans */
import {NotFound} from "../../components/notFound/not-found";
import {Title} from "@angular/platform-browser";

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
    constructor(public translate:TranslateService, private title:Title,private route: ActivatedRoute,private http:Http, private router:Router, private loginService:LoginService,private changeDetector: ChangeDetectorRef) {
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



