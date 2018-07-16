import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AvailablePicture } from './pipes/AvailablePicture.pipe';
import { DetectUrls } from './pipes/DetectUrls.pipe';
import { LoadingBar } from '../main/components/loading/loading-bar';

@NgModule({
  declarations: [
    AvailablePicture,
    DetectUrls,
    LoadingBar
  ],
  exports: [
    TranslateModule,
    AvailablePicture,
    DetectUrls,
    LoadingBar
  ]
})

export class SharedModule { }