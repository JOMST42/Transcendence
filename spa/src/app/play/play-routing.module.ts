import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent } from './components/game/game.component';
import { ModeSelectComponent } from './components/mode-select/mode-select.component';
import { RoomListComponent } from '../watch/components/room-list/room-list.component';

const routes: Routes = [
	{
    path: '',
    component: ModeSelectComponent
  },
  {
    path: 'mode',
    component: ModeSelectComponent
  },
	{
    path: 'classic',
    component: GameComponent
  },
	{
    path: 'custom',
    component: GameComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
