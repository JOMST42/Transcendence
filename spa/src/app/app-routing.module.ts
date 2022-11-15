import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards';
import { NotFoundComponent, ServerErrorComponent } from './shared/components';
import { SearchUserComponent } from './shared/components/search-user/search-user.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
    pathMatch: 'full',
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('./chat/chat.module').then((m) => m.ChatModule),
      },
      {
        path: 'play',
        loadChildren: () =>
          import('./play/play.module').then((m) => m.PlayModule),
      },
      {
        path: 'watch',
        loadChildren: () =>
          import('./watch/watch.module').then((m) => m.WatchModule),
      },
    ],
  },
  {
    path: 'watch',
    loadChildren: () =>
      import('./watch/watch.module').then((m) => m.WatchModule),
  },
  {
    path: 'server-error',
    component: ServerErrorComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: 'search',
    component: SearchUserComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
