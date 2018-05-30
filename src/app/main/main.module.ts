import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { SharedModule } from '../shared/shared.module';
import { NotFoundPage } from './components/404/404';
import { Comment } from './components/comment/comment';
import { Home } from './components/home/home';
import { LoadingBar } from './components/loading/loading-bar';
import { Main } from './components/main';
import { NotFound } from './components/notFound/not-found';
import { Notification } from './components/notification/notification';
import { Post } from './components/post/post';
import { Profile } from './components/profile/profile';
import { ContenteditableModel } from './components/publication/contenteditable-model';
import { Publication } from './components/publication/publication';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { TopBlagueursAndDecov } from './components/topBlagueursAndDecov/topBlagueursAndDecov';
import { MainRoutingModule } from './main.routing.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule,
    InfiniteScrollModule  
  ],
  declarations: [
    Notification, 
     Post,
      Profile,
       Main,
        Publication,
        Home,
        TopBlagueursAndDecov,
         SuggestionsComponent,
         Comment,
          ContenteditableModel,
          LoadingBar,
          NotFound,
          NotFoundPage
  ]
})
export class MainModule { }
