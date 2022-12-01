import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from '../shared/shared.module';
import { GameInviteComponent, InviteDialogComponent, JoinGameDialogComponent, PongInputComponent, PongScreenComponent } from './components';
import { Pong3DScreenComponent } from './components/pong-3dscreen/pong-3dscreen.component';
import { PongEndOverlayComponent } from './components/pong-end-overlay/pong-end-overlay.component';
import { PongScreenContainerComponent } from './components/pong-screen-container/pong-screen-container.component';
import { PongService } from './services/pong.service';
import { ReadyButtonComponent } from './components/ready-button/ready-button.component';
import { PongVersusComponent } from './components/pong-versus/pong-versus.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    declarations: [
        GameInviteComponent,
        InviteDialogComponent,
        JoinGameDialogComponent,
				PongVersusComponent,
        PongScreenContainerComponent,
        PongEndOverlayComponent,
        PongScreenComponent,
        Pong3DScreenComponent,
        PongInputComponent,
				ReadyButtonComponent,
				RoomListComponent,
    ],
    exports: [
        GameInviteComponent,
        InviteDialogComponent,
        JoinGameDialogComponent,
				PongVersusComponent,
        PongScreenContainerComponent,
        PongEndOverlayComponent,
        PongScreenComponent,
        Pong3DScreenComponent,
        PongInputComponent,
				ReadyButtonComponent,
				RoomListComponent,
    ],
    providers: [PongService],
    imports: [DialogModule, ButtonModule, CommonModule, SharedModule, DropdownModule]
})
export class PongModule {}