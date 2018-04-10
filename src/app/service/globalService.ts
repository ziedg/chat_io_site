import { EventEmitter, Injectable } from '@angular/core';


@Injectable()

export class GlobalService {
    showSearchMobile:boolean =  false;
    initSerachMobileOffset:number = -80;
    searchMobileOffset:number = this.initSerachMobileOffset;
    

    hideSearchMobile() {
        this.searchMobileOffset = this.initSerachMobileOffset;
        this.showSearchMobile = false;
    }
}