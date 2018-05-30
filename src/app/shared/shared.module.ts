import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  exports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ]
})

export class SharedModule { }