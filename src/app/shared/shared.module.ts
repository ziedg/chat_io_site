import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AvailablePicture } from './pipes/AvailablePicture.pipe';
import { DetectUrls } from './pipes/DetectUrls.pipe';

@NgModule({
  declarations: [
    AvailablePicture,
    DetectUrls,
  ],
  exports: [
    TranslateModule,
    AvailablePicture,
    DetectUrls
  ]
})

export class SharedModule { }