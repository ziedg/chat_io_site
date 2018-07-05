
import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot, ActivatedRoute, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { PublicationService } from './publication.service';

@Injectable()
export class PublicationResolver implements Resolve<any> {
  
  constructor(private publicationService: PublicationService,
               ) {
                
               }

  
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let id = route.paramMap.get('id');
    
    return this.publicationService.loadFirstPosts(id).map((res:Response) => {if (res) {
      return res.json();}
    });
    
    
  }
}