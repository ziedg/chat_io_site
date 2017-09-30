import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {Title} from "@angular/platform-browser";


@Component({
  moduleId: module.id,
    selector: 'not-found',
    templateUrl: 'not-found.html',
    inputs: ['type'],
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class NotFound {
    public type:string="page";
    constructor(private title:Title, private changeDetector: ChangeDetectorRef){
        this.changeDetector.markForCheck();
    }
    ngOnInit() {
        if(this.type=="page"){
            this.title.setTitle("Page introvable");
        }
        else  if(this.type=="profile"){
            this.title.setTitle("profile introvable");
        }
        else if(this.type=="post"){
            this.title.setTitle("publication introvable");
        }
        this.changeDetector.markForCheck();
    }

}



