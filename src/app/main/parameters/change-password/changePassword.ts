import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import { Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';



/* conf */
import {AppSettings} from '../../../conf/app-settings';

/* services */
import {LoginService} from '../../../service/loginService';

/* user  */
import {User} from '../../../beans/user';

/* beans */
import {NotFound} from "../../notFound/not-found";

declare var jQuery: any;
declare var swal: any;


@Component({
  moduleId: module.id,
    selector: 'change-password',
    templateUrl: 'changePassword.html',
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class ChangePassword {
    public user: User = new User();
	errNewPass2="";
    errNewPass1="";
    errOldPass="";
        form;
    constructor(private changeDetector: ChangeDetectorRef,private route: ActivatedRoute,private http:Http, private router:Router, private loginService:LoginService) {

		if (loginService.isConnected()) {
            loginService.actualize();
            this.user = loginService.user
        }
        else {
            this.router.navigate(['/login/sign-in']);
        }
        this.form = new FormGroup({
            oldPass: new FormControl('', Validators.required),
            newPass1: new FormControl('', Validators.required),
            newPass2: new FormControl('', Validators.required),
        });

    }
    saveData(){
        var oldPass = this.form.value.oldPass;
        var newPass1 = this.form.value.newPass1;
        var newPass2 = this.form.value.newPass2;

        if(newPass1<5){
            this.errNewPass1="Créez un mot de passe d’au moins 5 caractères.";
            return;
        }
        else {
            this.errNewPass1="";
        }
        if(newPass2<5 || newPass1!=newPass2){
            this.errNewPass2="Les deux mots de passe ne sont pas identiques.";
            return;
        }
        else {
            this.errNewPass2="";
        }
        this.changeDetector.markForCheck();
        let body = JSON.stringify({
            profileId: this.user._id,//user._id
            oldPassword: oldPass,
            newPassword:newPass1
        });
         this.http.post(AppSettings.SERVER_URL + 'updatePassword', body, AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
            response => {
                if(response.status==0){
                    this.errOldPass="Mot de passe irroné";
                    this.changeDetector.markForCheck();
                }
                else {
                    this.errOldPass="";
                    swal({
                            title: "Modifié!",
                            text: "votre mot de passe a éte actualisé",
                            type: "success",
                            timer: 2000,
                            showConfirmButton: false
                    }).then(function(){},function(dismiss){});
                }
            },
            err => {},
            () => {
                this.changeDetector.markForCheck();
            }
            );

    }


}



