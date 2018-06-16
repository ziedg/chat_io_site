import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChangePassword } from './components/change-password/changePassword';
import { EditProfile } from './components/edit-profile/editProfile';
import { Parameters } from './components/parameters';


const parametersRoutes: Routes = [
    {
        path: '', component: Parameters,
        children: [
            {path: '', redirectTo: 'edit-profile', pathMatch: 'full'},
            {path: 'edit-profile', component: EditProfile},
            {path: 'change-password', component: ChangePassword}
        ]
    }
];
@NgModule({

    imports: [
      RouterModule.forChild(parametersRoutes)
    ],
    exports: [RouterModule]

  })
  export class ParametersRoutingModule {}
