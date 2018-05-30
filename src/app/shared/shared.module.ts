import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  exports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ]
})

export class SharedModule { }