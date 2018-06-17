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
import { NotFoundPage } from './main/components/404/404';
import { Comment } from './main/components/comment/comment';
import { Home } from './main/components/home/home';
import { LoadingBar } from './main/components/loading/loading-bar';
import { Main } from './main/components/main';
import { NotFound } from './main/components/notFound/not-found';
import { Notification } from './main/components/notification/notification';
import { Post } from './main/components/post/post';
import { Profile } from './main/components/profile/profile';
import { ContenteditableModel } from './main/components/publication/contenteditable-model';
import { Publication } from './main/components/publication/publication';
import { SuggestionsComponent } from './main/components/suggestions/suggestions.component';
import { TopBlagueursAndDecov } from './main/components/topBlagueursAndDecov/topBlagueursAndDecov';
import { DateService } from './main/services/dateService';
import { EmojiService } from './main/services/emojiService';
import { LinkPreview } from './main/services/linkPreview';
import { LinkView } from './main/services/linkView';
import { PostService } from './main/services/postService';
import { RecentRechService } from './main/services/recentRechService';
import { SeoService } from './main/services/seo-service';
import { SocketService } from './main/services/socket.service';
import { EmitterService } from './messaging/emitter.service';
import { ChatService } from './messanging/chat.service';
import { FakeComponent } from './shared/fake.component';
import { httpFactory } from './utils/factories/http.factory';
import { MessagingModule } from './messaging/messaging.module';
import { SearchMobile } from "./main/components/search-mobile/search-mobile.component";
import { FacebookFriends } from './main/components/facebookFriends/facebookFriends';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
import { AngularFireDatabase } from 'angularfire2/database';

/** Factories */
@NgModule({
    imports: [
      BrowserModule, CommonModule, FormsModule, InfiniteScrollModule  ,
      ReactiveFormsModule, HttpModule, RouterModule, AppRoutingModule,Ng2ImgMaxModule,
      HttpClientModule,
      MessagingModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient,Http]
        }
      }),
      //TODO : change after test
      AngularFireModule.initializeApp({
        apiKey: "AIzaSyAnCqxH5CTNWksJH6j59jIKjxkVJOyEyIk",
        authDomain: "speegar-6deca.firebaseapp.com",
        databaseURL: "https://speegar-6deca.firebaseio.com",
        projectId: "speegar-6deca",
        storageBucket: "speegar-6deca.appspot.com",
        messagingSenderId: "861552240215"
      }),
      AngularFireDatabaseModule
    ],       
    // module dependencies
    declarations: [AppComponent, Comment, LoadingBar,  NotFoundPage, Home, NotFound, Logout ,Notification,  Post, Profile, Main, Publication,
        TopBlagueursAndDecov,FacebookFriends, GoogleRecaptchaDirective,
        FakeComponent, ContenteditableModel, SuggestionsComponent, SearchMobile],   // components and directives
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
        SocketService,
        EmitterService,
        ChatService,
        ResetPasswordService,
        {
          provide: Http, useFactory: httpFactory,
          deps: [XHRBackend, RequestOptions, Injector],
          multi: false
        },
        {provide: LocationStrategy, useClass: PathLocationStrategy},
        {provide: APP_BASE_HREF, useValue: '/'},
        AngularFireDatabase
    ],

})
export class AppModule {
}


// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
