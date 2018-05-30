import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ChangePassword } from './components/change-password/changePassword';
import { EditProfile } from './components/edit-profile/editProfile';
import { Parameters } from './components/parameters';
import { ParametersRoutingModule } from './parameters.routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ParametersRoutingModule,
    FormsModule,
    ReactiveFormsModule

  ],
  declarations:[
    ChangePassword, 
    EditProfile,
    Parameters,
  ]
})

export class ProfileParametersModule { }