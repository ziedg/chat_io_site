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
import { Comment } from './comment/comment';
import { LoadingBar } from './loading/loading-bar';
import { LoginService } from './login/services/loginService';
import { ResetPasswordService } from './login/services/reset-password.service';
import { Logout } from './logout/logout';
import { NotFoundPage } from './main/404/404';
import { Home } from './main/home/home';
import { Main } from './main/main';
import { NotFound } from './main/notFound/not-found';
import { Notification } from './main/notification/notification';
import { Post } from './main/post/post';
import { Profile } from './main/profile/profile';
import { SuggestionsComponent } from './main/suggestions/suggestions.component';
import { ContenteditableModel } from './publication/contenteditable-model';
import { Publication } from './publication/publication';
import { DateService } from './service/dateService';
import { EmojiService } from './service/emojiService';
import { GlobalService } from './service/globalService';
import { GoogleRecaptchaDirective } from './service/googlerecaptcha';
import { LinkPreview } from './service/linkPreview';
import { LinkView } from './service/linkView';
import { PostService } from './service/postService';
import { RecentRechService } from './service/recentRechService';
import { SeoService } from './service/seo-service';
import { FakeComponent } from './shared/fake.component';
import { TopBlagueursAndDecov } from './topBlagueursAndDecov/topBlagueursAndDecov';
import { httpFactory } from './utils/factories/http.factory';

/** Factories */
@NgModule({
    imports: [BrowserModule, CommonModule, FormsModule, InfiniteScrollModule  ,
      ReactiveFormsModule, HttpModule, RouterModule, AppRoutingModule,Ng2ImgMaxModule,
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })],       // module dependencies
    declarations: [AppComponent, Comment, LoadingBar,  NotFoundPage, Home, NotFound, Logout ,Notification,  Post, Profile, Main, Publication,
        TopBlagueursAndDecov, GoogleRecaptchaDirective,
        FakeComponent, ContenteditableModel, SuggestionsComponent],   // components and directives
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
