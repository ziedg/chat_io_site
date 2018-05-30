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
import { Comment } from './main/components/comment/comment';
import { LoadingBar } from './main/components/loading/loading-bar';
import { LoginService } from './login/services/loginService';
import { ResetPasswordService } from './login/services/reset-password.service';
import { Logout } from './logout/logout';
import { NotFoundPage } from './main/components/404/404';
import { Home } from './main/components/home/home';
import { Main } from './main/components/main';
import { NotFound } from './main/components/notFound/not-found';
import { Notification } from './main/components/notification/notification';
import { Post } from './main/components/post/post';
import { Profile } from './main/components/profile/profile';
import { SuggestionsComponent } from './main/components/suggestions/suggestions.component';
import { ContenteditableModel } from './main/components/publication/contenteditable-model';
import { Publication } from './main/components/publication/publication';
import { DateService } from './main/services/dateService';
import { EmojiService } from './main/services/emojiService';
import { GlobalService } from './main/services/globalService';
import { GoogleRecaptchaDirective } from './directives/googlerecaptcha';
import { LinkPreview } from './main/services/linkPreview';
import { LinkView } from './main/services/linkView';
import { PostService } from './main/services/postService';
import { RecentRechService } from './main/services/recentRechService';
import { SeoService } from './main/services/seo-service';
import { FakeComponent } from './shared/fake.component';
import { TopBlagueursAndDecov } from './main/components/topBlagueursAndDecov/topBlagueursAndDecov';
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
