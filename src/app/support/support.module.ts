import { Team } from './components/team/team';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUs } from './components/about-us/aboutUs';
import { Cgu } from './components/cgu/cgu';
import { Support } from './components/support';
import { SupportRoutingModule } from './support.routing.module';

@NgModule({
  declarations: [
    AboutUs,
    Cgu,
  Team,
Support
],
  imports: [
    CommonModule,
    SupportRoutingModule
  ]
  
})
export class SupportModule { }
