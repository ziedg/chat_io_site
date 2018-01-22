import {NgModule, ChangeDetectorRef, Provider, Injector}      from '@angular/core';
import {CommonModule}        from '@angular/common';
import {BrowserModule, Title} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule}         from '@angular/forms';
import {APP_BASE_HREF, PathLocationStrategy, LocationStrategy} from '@angular/common';
import { HttpModule, Http, CookieXSRFStrategy, XSRFStrategy, RequestOptions, XHRBackend } from '@angular/http';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';

import {AppComponent}  from './app.component';
import {LoginService} from "./service/loginService";
import {DateService} from "./service/dateService";
import {RecentRechService} from "./service/recentRechService";
import {EmojiService} from "./service/emojiService";
import {LinkView} from "./service/linkView";
import {LinkPreview} from "./service/linkPreview";
import {PostService} from "./service/postService";
import {SeoService} from "./service/seo-service";
import {Main} from "./main/main";
import {Support} from "./support/support";
import {Login} from "./login/login";
import {Logout} from "./logout/logout";
import {Post} from "./main/post/post";
import {NotFoundPage} from "./main/404/404";
import {AppRoutingModule} from "./app-routing.module";
import {Comment} from "./comment/comment";
import {LoadingBar} from "./loading/loading-bar";
import {FacebookLogin} from "./login/facebookLogin/facebookLogin";
import {Signin} from "./login/signin/signin";
import {Signup} from "./login/signup/signup";
import {Home} from "./main/home/home";
import {NotFound} from "./main/notFound/not-found";
import {Notification} from "./main/notification/notification";
import {ChangePassword} from "./main/parameters/change-password/changePassword";
import {EditProfile} from "./main/parameters/edit-profile/editProfile";
import {Parameters} from "./main/parameters/parameters";
import {Profile} from "./main/profile/profile";
import {Publication} from "./publication/publication";
import {AboutUs} from "./support/about-us/aboutUs";
import {Cgu} from "./support/cgu/cgu";
import {Team} from "./support/team/team";
import {TopBlagueursAndDecov} from "./topBlagueursAndDecov/topBlagueursAndDecov";
import {GoogleRecaptchaDirective} from "./service/googlerecaptcha";
import {RouterModule} from '@angular/router';
import {ForgetPasswordComponent} from "./login/forget-password/forget-password.component";
import {ResetPasswordComponent} from "./login/reset-password/reset-password.component";
import {ResetPasswordService} from "./login/reset-password/reset-password.service";
import {FakeComponent} from "./shared/fake.component";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

/** Factories */
import { httpFactory } from './utils/factories/http.factory';
import {ContenteditableModel} from "./publication/contenteditable-model";
import { SuggestionsComponent } from './main/suggestions/suggestions.component';

@NgModule({
    imports: [BrowserModule, CommonModule, FormsModule, InfiniteScrollModule  ,
      ReactiveFormsModule, HttpModule, RouterModule, AppRoutingModule,
      TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      })],       // module dependencies
    declarations: [AppComponent, Comment, LoadingBar, FacebookLogin,
        Signin, Signup, Login, Logout, NotFoundPage, Home, NotFound, Notification, ChangePassword, EditProfile,
        Parameters, Post, Profile, Main, Publication, AboutUs, Cgu, Team, Support,
        TopBlagueursAndDecov, GoogleRecaptchaDirective, ForgetPasswordComponent, ResetPasswordComponent,
        FakeComponent, ContenteditableModel, SuggestionsComponent],   // components and directives
    bootstrap: [AppComponent],     // root component
    providers: [
        <Provider> ChangeDetectorRef,
        LoginService,
        DateService,
        Title,
        RecentRechService,
        EmojiService,
        LinkView,
        LinkPreview,
        PostService,
        SeoService,
        ResetPasswordService,
        {
          provide: Http, useFactory: httpFactory,
          deps: [XHRBackend, RequestOptions, Injector],
          multi: false
        },
        {provide: LocationStrategy, useClass: PathLocationStrategy},
        {provide: APP_BASE_HREF, useValue: '/'}
    ],

})
export class AppModule {
}


export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/translations', '.json');
}
