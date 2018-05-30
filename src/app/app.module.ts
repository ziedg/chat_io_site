import { APP_BASE_HREF, CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Injector, NgModule, Provider } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleRecaptchaDirective } from './directives/googlerecaptcha';
import { LoginService } from './login/services/loginService';
import { ResetPasswordService } from './login/services/reset-password.service';
import { Logout } from './logout/logout';
import { MainModule } from './main/main.module';
import { DateService } from './main/services/dateService';
import { EmojiService } from './main/services/emojiService';
import { GlobalService } from './main/services/globalService';
import { LinkPreview } from './main/services/linkPreview';
import { LinkView } from './main/services/linkView';
import { PostService } from './main/services/postService';
import { RecentRechService } from './main/services/recentRechService';
import { SeoService } from './main/services/seo-service';
import { FakeComponent } from './shared/fake.component';
import { httpFactory } from './utils/factories/http.factory';

/** Factories */
@NgModule({
    imports: [BrowserModule,
       CommonModule,
        FormsModule, 
        InfiniteScrollModule  ,
      ReactiveFormsModule, 
      HttpModule, RouterModule,
       AppRoutingModule,
       Ng2ImgMaxModule,
      HttpClientModule,
      MainModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })],       // module dependencies
    declarations: [AppComponent, 
       Logout ,
         GoogleRecaptchaDirective,
        FakeComponent],   // components and directives
    bootstrap: [AppComponent],     // root component
    providers: [
        <Provider> ChangeDetectorRef,
        DateService,
        Title,
        RecentRechService,
        EmojiService,
        LinkView,
        LinkPreview,
        PostService,
        SeoService,
        LoginService,
        ResetPasswordService,
        {
          provide: Http, useFactory: httpFactory,
          deps: [XHRBackend, RequestOptions, Injector],
          multi: false
        },
        {provide: LocationStrategy, useClass: PathLocationStrategy},
        {provide: APP_BASE_HREF, useValue: '/'},
        GlobalService,
    ],

})
export class AppModule {
}


// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
