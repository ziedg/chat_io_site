import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot, ActivatedRoute, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { ProfileService } from './profile.service';

@Injectable()
export class ProfileResolver implements Resolve<any> {
  
  constructor(private profileService: ProfileService,
               ) {
                
               }

  
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let id = route.paramMap.get('id');
    
    return this.profileService.getProfile(id).map((res:Response) => {if (res) {
      return res.json();}
    });
    
    
  }
}