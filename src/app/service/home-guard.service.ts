import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { LoginService } from './loginService';


@Injectable()
export class HomeGuardService implements CanActivate, CanActivateChild {
  constructor(private loginService: LoginService, 
    private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
                if(!this.loginService.isConnected()){
                  if(this.loginService.isWasConnectedWithFacebook()){
                    this.router.navigate(['/login/facebook-login']);
                    return false;
                  }else{
                    this.router.navigate(['/login/sign-in']);
                    return false;
                  }
                }
                return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}

