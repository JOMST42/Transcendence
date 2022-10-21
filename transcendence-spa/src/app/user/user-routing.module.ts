import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePageComponent } from './components';
import { UserResolver } from './user.resolver';

const routes: Routes = [
  {
    path: ':id',
    component: ProfilePageComponent,
    resolve: { data: UserResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
