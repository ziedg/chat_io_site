import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {Main} from './main/main';
import {Login} from './login/login';

/* Main components  */
import {Profile} from './main/profile/profile';
import {Parameters} from './main/parameters/parameters';
import {Home} from './main/home/home';
import {Notification} from './main/notification/notification';
import {Support} from './support/support';

/* parameters components */
import {EditProfile} from './main/parameters/edit-profile/editProfile';
import {ChangePassword} from './main/parameters/change-password/changePassword';


/* login components  */
import {Signin} from './login/signin/signin';
import {Signup} from './login/signup/signup';


import {FacebookLogin} from './login/facebookLogin/facebookLogin';
import {Logout} from "./logout/logout";
import {Post} from "./main/post/post";
import {NotFoundPage} from "./main/404/404";

/* support components */
import {Cgu} from './support/cgu/cgu';
import {AboutUs} from './support/about-us/aboutUs'
import {Team} from './support/team/team'
import {ForgetPasswordComponent} from "./login/forget-password/forget-password.component";
import {ResetPasswordComponent} from "./login/reset-password/reset-password.component";
import {FakeComponent} from "./shared/fake.component";
import { HomeGuardService } from './service/home-guard.service';

export const routes: Routes = [
    {path: 'redirect', component: FakeComponent},
    {
        path: '',
        redirectTo: '/main/home',
        canActivate:[HomeGuardService],
        pathMatch: 'full'
        //terminal: true
    },
    {
        path: 'login',
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
    },
    {
        path: 'main',
        component: Main,
        children: [
            {path: '', redirectTo: 'home', pathMatch: 'full'},
            {path: 'home', component: Home , canActivate[HomeGuardService]},
            {path: 'profile/:id', component: Profile},
            {
                path: 'parameters', component: Parameters,
                children: [
                    {path: '', redirectTo: 'edit-profile', pathMatch: 'full'},
                    {path: 'edit-profile', component: EditProfile},
                    {path: 'change-password', component: ChangePassword}
                ]
            },
            {path: 'post/:id', component: Post},
            {path: 'notification', component: Notification},
            {path: '404', component: NotFoundPage},
            {path: '**', redirectTo: '404'}
        ]
    },
    {
        path: 'logout',
        component: Logout
    },
    {
        path: 'support',
        component: Support,
        children: [
            {path: '', redirectTo: 'about-us', pathMatch: 'full'},
            {path: 'about-us', component: AboutUs},
            {path: 'team', component: Team},
            {path: 'cgu', component: Cgu}
        ]
    },
    {
        path: '**',
        redirectTo: '/main/404'
    }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

