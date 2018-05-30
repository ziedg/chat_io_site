import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { NotFoundPage } from './components/404/404';
import { NotFound } from './components/notFound/not-found';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    NotFoundPage,
    NotFound
  ],
  exports:[
    NotFound
  ]
})
export class NotFoundPagesModule { }
