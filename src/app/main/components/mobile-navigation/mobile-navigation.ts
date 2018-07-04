import { Component } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: "mobile-navigation",
    templateUrl: "mobile-navigation.html",
    styleUrls: ["mobile-navigation.css"]
})

export class MobileNavigation {
    constructor(private translate: TranslateService) {
    }
}