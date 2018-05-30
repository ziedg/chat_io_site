import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from './components/post/post';
import { Profile } from './components/profile/profile';
import { Comment } from './components/comment/comment';
import { Notification } from './components/notification/notification';


import { Main } from './components/main';
import { Publication } from './components/publication/publication';
import { Home } from './components/home/home';
import { TopBlagueursAndDecov } from './components/topBlagueursAndDecov/topBlagueursAndDecov';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { SharedModule } from '../shared/shared.module';
import { MainRoutingModule } from './main.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ContenteditableModel } from './components/publication/contenteditable-model';
import { LoadingBar } from './components/loading/loading-bar';
import { NotFound } from './components/notFound/not-found';
import { NotFoundPage } from './components/404/404';

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
