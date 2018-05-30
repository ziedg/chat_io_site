import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Main } from './components/main';
import { Home } from './components/home/home';
import { Profile } from './components/profile/profile';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { Post } from './components/post/post';
import { NotFoundPage } from './components/404/404';


const mainRoutes: Routes = [
    
    {
        path: 'main', component: Main,
        children: [
            {path: '', redirectTo: 'home', pathMatch: 'full'},
            {path: 'home', component: Home },
            {path: 'profile/:id', component: Profile},
            {
                path: 'parameters', 
                loadChildren: './parameters/parameters.module#ProfileParametersModule'
            },
			{ path: 'suggestions', component: SuggestionsComponent },
            {path: 'post/:id', component: Post},
            {path: 'notification', component: Notification},
            {path: '404', component:NotFoundPage},
            {path: '**', redirectTo: '404'}
        ]
    },
    {
        path: '**',
        redirectTo: '/main/404'
    }
]
@NgModule({

    imports: [
      RouterModule.forChild(mainRoutes)
    ],
    exports: [RouterModule]
   
  })
  export class MainRoutingModule {}