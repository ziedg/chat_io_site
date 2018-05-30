import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Support } from './components/support';
import { AboutUs } from './components/about-us/aboutUs';
import { Team } from './components/team/team';
import { Cgu } from './components/cgu/cgu';

const supportRoutes: Routes = [
    {
        path: '',
        component: Support,
        children: [
            {path: '', redirectTo: 'about-us', pathMatch: 'full'},
            {path: 'about-us', component: AboutUs},
            {path: 'team', component: Team},
            {path: 'cgu', component: Cgu}
        ]
    },];

@NgModule({

    imports: [
      RouterModule.forChild(supportRoutes)
    ],
    exports: [RouterModule]
   
  })
  export class SupportRoutingModule {}
  