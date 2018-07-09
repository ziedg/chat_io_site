import { APP_BASE_HREF, CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Injector, NgModule, Provider } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, AngularFireDatabaseModule } from 'angularfire2/database';
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
import { FacebookFriends } from './main/components/facebookFriends/facebookFriends';
import { Home } from './main/components/home/home';
import { LoadingBar } from './main/components/loading/loading-bar';
import { Main } from './main/components/main';
import { NotFound } from './main/components/notFound/not-found';
import { Notification } from './main/components/notification/notification';
import { Post } from './main/components/post/post';
import { Profile } from './main/components/profile/profile';
import { ContenteditableModel } from './main/components/publication/contenteditable-model';
import { Publication } from './main/components/publication/publication';
import { SearchMobile } from './main/components/search-mobile/search-mobile.component';
import { SuggestionsComponent } from './main/components/suggestions/suggestions.component';
import { TopBlagueursAndDecov } from './main/components/topBlagueursAndDecov/topBlagueursAndDecov';
import { DateService } from './main/services/dateService';
import { EmojiService } from './main/services/emojiService';
import { GifService } from './main/services/gifService';
import { LinkPreview } from './main/services/linkPreview';
import { LinkView } from './main/services/linkView';
import { PostService } from './main/services/postService';
import { RecentRechService } from './main/services/recentRechService';
import { SeoService } from './main/services/seo-service';
import { EmitterService } from './messaging/emitter.service';
import { MessagingModule } from './messaging/messaging.module';
import { ChatService } from './messanging/chat.service';
import { FakeComponent } from './shared/fake.component';
import { httpFactory } from './utils/factories/http.factory';
import { GifSlider } from './main/components/gif-slider/gif-slider';
import { ProfileService } from '../app/main/components/profile/profile.service';


import { LoveReaction} from './main/components/publication/reactions/love-reaction/love-reaction'
import { LikeReaction} from './main/components/publication/reactions/like-reaction/like-reaction'
import { PublicationService } from './main/components/profile/publication.service';
import { MobileNavigation } from './main/components/mobile-navigation/mobile-navigation';
import { PublicationTextService } from './main/services/publicationText.service';

/** Factories */

import { ClickOutsideModule } from 'ng-click-outside';
import { SharedModule } from './shared/shared.module';

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
      AngularFireDatabaseModule,
      ClickOutsideModule,
      SharedModule
    ],
    // module dependencies
    declarations: [AppComponent, Comment, LoadingBar,  NotFoundPage, Home, NotFound, Logout ,Notification,  Post, Profile, Main, Publication,
        TopBlagueursAndDecov,FacebookFriends, GoogleRecaptchaDirective,
        FakeComponent, ContenteditableModel, SuggestionsComponent, SearchMobile, GifSlider, LoveReaction, LikeReaction, MobileNavigation],   // components and directives
    bootstrap: [AppComponent],     // root component
    providers: [
        <Provider> ChangeDetectorRef,
        DateService,
        Title,
        RecentRechService,
        EmojiService,
        GifService,
        LinkView,
        LinkPreview,
        PostService,
        SeoService,
        LoginService,
        EmitterService,
        ChatService,
        ResetPasswordService,
        ProfileService,
        PublicationService,
        PublicationTextService,
        
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
