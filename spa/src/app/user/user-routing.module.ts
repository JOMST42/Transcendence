import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfilePageComponent } from './components';
import { UserResolver } from './user.resolver';

const routes: Routes = [
  {
    path: ':id',
    component: ProfilePageComponent,
    resolve: { user: UserResolver },
  },
	{
    path: '',
    component: ProfilePageComponent,
    resolve: { user: UserResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
