import {Component, ChangeDetectorRef, ChangeDetectionStrategy, Input} from '@angular/core';
import {Title} from "@angular/platform-browser";

/* services */
import {TranslateService} from '@ngx-translate/core';


@Component({
  moduleId: module.id,
  selector: 'not-found',
  templateUrl: 'not-found.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class NotFound {
 @Input() type:string = "page";

  constructor(public translate:TranslateService,
              private title:Title,
              private changeDetector:ChangeDetectorRef) {
  }

  ngOnInit() {
    if (this.type == "page") {
      this.title.setTitle(this.translateCode("not_found_title_page"));
    }
    else if (this.type == "profile") {
      this.title.setTitle(this.translateCode("not_found_title_profile"));
    }
    else if (this.type == "post") {
      this.title.setTitle(this.translateCode("not_found_title_post"));
    }
    this.changeDetector.markForCheck();
  }


  translateCode(code) {
    let message;
    this.translate.get(code).subscribe((resTranslate:string) => {
      message = resTranslate;
    });
    return message;
  }
}



