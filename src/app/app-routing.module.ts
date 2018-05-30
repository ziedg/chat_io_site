import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Logout } from './logout/logout';
import { FakeComponent } from './shared/fake.component';


export const routes: Routes = [
    {path: '', redirectTo: '/main/home', pathMatch: 'full'},
    {path: 'redirect', component: FakeComponent},
    { path: 'login', 
    loadChildren: './login/login.module#LoginModule'},
     {
        path: 'logout',
        component: Logout
    },   
    
    {
        path: 'support',
        loadChildren: './support/support.module#SupportModule'
    }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
