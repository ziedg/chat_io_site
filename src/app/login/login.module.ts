import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { FacebookLogin } from './components/facebookLogin/facebookLogin';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { Login } from './components/login';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { Signin } from './components/signin/signin';
import { Signup } from './components/signup/signup';
import { LoginRoutingModule } from './login.routing.module';

@NgModule({
  declarations: [
    FacebookLogin,
    Signin,
     Signup,
      Login, 
      ForgetPasswordComponent,
       ResetPasswordComponent
    
  ]
  ,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoginRoutingModule,
    SharedModule
    
  ]
  
})
export class LoginModule { }
