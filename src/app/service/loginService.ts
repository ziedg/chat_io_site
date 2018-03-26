import { Injectable}     from '@angular/core';
import { Router } from '@angular/router';

/* beans */
import {User} from './../beans/user'
import {SocialUser} from "../beans/social-user";
import {environment} from "../../environments/environment";


@Injectable()
export class LoginService {
    /* token */
    public token: string;
    /* User */
    public user : User;

    /* constructor  */
    constructor(private router:Router){
        this.actualize();
    }

    /* isConnected  */
    isConnected():boolean{
        if(localStorage.getItem('token')){
            return true;
        }
        return false;
    }

    /* isWasConnectedWithFacebook */
    isWasConnectedWithFacebook(): boolean{
        if(localStorage.getItem('facebookUser')){
            return true;
        }
        return false;
    }
    isWasConnectedWithGoogle(): boolean{
        if(localStorage.getItem('googleUser')){
            return true;
        }
        return false;
    }

    
    redirect(){
      if(!this.isConnected()){
        if(this.isWasConnectedWithFacebook()){
          console.log("/login/facebook-login")
          this.router.navigate(['/login/facebook-login']);
        }else{
          this.router.navigate(['/login/sign-in']);
        }
      }
    }

    /* getFacebookUser */
    getFacebookUser(): SocialUser{
        if(this.isWasConnectedWithFacebook()){
           return JSON.parse(localStorage.getItem('facebookUser'));
        }
        return null;
    }

    deleteUserFacebook(){
        localStorage.removeItem('facebookUser');
    }

    /* actualize */
    actualize(){
        if(this.isConnected()){
            this.token = localStorage.getItem('token');

            this.user= JSON.parse(localStorage.getItem('user'));
            console.log(this.user);

        }
    }

    /* updateUser */
    updateUser(user:User){
            this.user=user;
            localStorage.setItem('user', JSON.stringify(user));
    }

    /* setToken */
    setToken(token : string){
        this.token=token;
        localStorage.setItem('token', token);
    }

    /* getToken */
    getToken():string{
        return this.token;
    }

    /* getUser */
    getUser():User{
        this.user= JSON.parse(localStorage.getItem('user'));
        return this.user;
    }

    /* deconnexion */
    logout(){
        if(this.isConnected()){
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        if(localStorage.getItem('lastConnexionMethod')){
                if(localStorage.getItem('lastConnexionMethod')=="g+"){
                        this.router.navigate(['/login/google-login']);

                }
                else if(localStorage.getItem('lastConnexionMethod')=="fb"){
                        this.router.navigate(['/login/facebook-login']);
                }
                else if(localStorage.getItem('lastConnexionMethod')=="nr"){
                        this.router.navigate(['/login/sign-in']);
                }
                else{
                    this.router.navigate(['/login/sign-in']);
                }
        }
        else{
                    this.router.navigate(['/login/sign-in']);
        }
    }
}
