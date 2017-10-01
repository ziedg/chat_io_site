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
import {environment} from "../../../../environments/environment";

declare var jQuery: any;
declare var swal: any;


@Component({
  moduleId: module.id,
    selector: 'edit-profile',
    templateUrl: 'editProfile.html',
    changeDetection: ChangeDetectionStrategy.OnPush

})


export class EditProfile {
    form;
    public user: User = new User();
    public errFistName="";
    public errLastName="";
    public errLinkFB="";
    public errLinkYoutube="";
    public errLinkTwitter="";
    constructor(private route: ActivatedRoute,private http:Http,private changeDetector: ChangeDetectorRef, private router:Router, private loginService:LoginService) {

        if (loginService.isConnected()) {
            loginService.actualize();
            this.user = loginService.getUser();
        }
        else {
            this.router.navigate(['/login/sign-in']);
        }
        this.form = new FormGroup({
            lastName: new FormControl('', Validators.required),
            firstName: new FormControl('', Validators.required),
            userDiscrip: new FormControl(),
            genre: new FormControl(),
            linkFB: new FormControl(),
            linkTwitter: new FormControl(),
            linkYoutube: new FormControl()
        });
    }
    ngOnInit(){
        this.loginService.actualize();
        this.user = this.loginService.getUser();
        this.changeDetector.markForCheck();
        console.log(this.user);
    }
    getFirstName():string{
        if(this.form.value.firstName){
            return this.form.value.firstName;
        }
        else {
            return jQuery("#firstName").val();
        }
    }
    checkFirstName():boolean{
        if(this.getFirstName() && this.getFirstName().length>1){
            this.errFistName="";
            return true;
        }
        else {
            this.errFistName="Le prénom est obligatoire.";
            return false;
        }
    }
    getLastName():string{
        if(this.form.value.lastName){
            return this.form.value.lastName;
        }
        else {
            return jQuery("#lastName").val();
        }
    }
    getDisc():string{
            return jQuery("#userDiscrip").val();
    }
    getGerne():string{
            return jQuery("#genre").val();
    }
    getFBLink():string{
            return jQuery("#linkFB").val();
    }
    getYoutubeLink():string{
            return jQuery("#linkYoutube").val();
    }
    getTwitterLink():string{
            return jQuery("#linkTwitter").val();
    }

    checkLasttName():boolean{
        if(this.getLastName() && this.getLastName().length>1){
            this.errLastName="";
            return true;
        }
        else {
            this.errLastName="Le nom est obligatoire.";
            return false;
        }
    }
    checkYoutubeLink(){
        if(this.getYoutubeLink() && ( this.getYoutubeLink().indexOf("https://www.youtube.com/") == 0 || this.getYoutubeLink().indexOf("https://youtube.com/") == 0|| this.getYoutubeLink().indexOf("http://www.youtube.com/") == 0 || this.getYoutubeLink().indexOf("http://youtube.com/") == 0)  ){
            this.errLinkYoutube="";
            return true;
        }
        else if(this.getYoutubeLink().length==0){
            this.errLinkYoutube="";
            return true;
        }
        else {
            this.errLinkYoutube="Lien youtube erroné";
            return false;
        }
    }
    checkTwitterLink(){
        if(this.getTwitterLink() && ( this.getTwitterLink().indexOf("https://www.twitter.com/") == 0 || this.getTwitterLink().indexOf("https://twitter.com/") == 0|| this.getTwitterLink().indexOf("http://www.twitter.com/") == 0 || this.getTwitterLink().indexOf("http://twitter.com/") == 0)  ){
            this.errLinkTwitter="";
            return true;
        }
        else if(this.getTwitterLink().length==0){
            this.errLinkTwitter="";
            return true;
        }
        else {
            this.errLinkTwitter="Lien twitter erroné";
            return false;
        }
    }
    checkFBLink(){
        if(this.getFBLink() && ( this.getFBLink().indexOf("https://www.facebook.com/") == 0 || this.getFBLink().indexOf("https://facebook.com/") == 0|| this.getFBLink().indexOf("http://www.facebook.com/") == 0 || this.getFBLink().indexOf("http://facebook.com/") == 0)  ){
            this.errLinkFB="";
            return true;
        }
        else if(this.getFBLink().length==0){
            this.errLinkFB="";
            return true;
        }
        else {
            this.errLinkFB="Lien facebook erroné";
            return false;
        }
    }
    saveData(){
        if(this.checkFBLink()&&this.checkFirstName()&&this.checkLasttName()&&this.checkTwitterLink()&&this.checkYoutubeLink()&&this.checkFBLink()){
                var gender="";
                if(this.getGerne()=="Homme"){
                    gender="male";
                }else if(this.getGerne()=="Femme"){
                    gender="female";
                }
                console.log(this.getGerne());
                console.log(gender);
             let body = JSON.stringify({
                    profileId: this.user._id,
                    firstName: this.getFirstName(),
                    lastName: this.getLastName(),
                    facebookLink:this.getFBLink(),
                    twitterLink:this.getTwitterLink(),
                    youtubeLink:this.getYoutubeLink(),
                    gender: gender,
                    about: this.getDisc()
                });
                this.http.post(environment.SERVER_URL + 'updateProfile', body, AppSettings.OPTIONS)
                    .map((res: Response) => res.json())
                    .subscribe(
                    response => {
                        console.log(response.profile);
                        if(response.status==1){
                        this.loginService.updateUser(response.profile);
                        this.loginService.actualize();
                        this.user=this.loginService.getUser();
                        this.changeDetector.markForCheck();

                        swal({
                            title: "Modifié!",
                            text: "votre profil a été modifié",
                            type: "success",
                            timer: 2000,
                            showConfirmButton: false
                        }).then(function(){},function(dismiss){});
                        }
                    },
                    err => {},
                    () => {
                    }
                    );
        }
    }


}



