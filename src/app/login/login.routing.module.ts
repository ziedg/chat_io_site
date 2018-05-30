import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FacebookLogin } from './components/facebookLogin/facebookLogin';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { Signin } from './components/signin/signin';
import { Signup } from './components/signup/signup';
import { Login } from './components/login';


const loginRoutes: Routes = [
    {
        path: '',
        component: Login,
        children: [
            {path: '', redirectTo: 'sign-in', pathMatch: 'full'},
            {path: 'sign-in', component: Signin},
            {path: 'sign-up', component: Signup},
            {path: 'forget-password', component: ForgetPasswordComponent},
            {path: 'reset-password/:code', component: ResetPasswordComponent},
            {path: 'facebook-login', component: FacebookLogin},
            {path: '**', redirectTo: 'sign-in'}
        ]
    }
   
];

@NgModule({

  imports: [
    RouterModule.forChild(loginRoutes)
  ],
  exports: [RouterModule]
  
})
export class LoginRoutingModule {}
