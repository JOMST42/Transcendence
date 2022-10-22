import {
  trigger,
  animate,
  transition,
  style,
  state,
  animation,
} from '@angular/animations';

export const ballAnimation = animation([
  style({
    left: '{{ leftBall }}',
    top: '{{ topBall }}',
  }),
  animate('{{ time }}'),
]);

// export const ballAnimation = trigger('ballAnimation',
//   [
// 		state('*', style({
// 			left: '{{ leftBall }}vw',
// 			top: '{{ topBall }}vh',
// 		}), {params: { leftBall: '100px', topBall: '100px'}}),
//     transition('* => *',
// 			animate('{{ time }} ease-in', ),
// 		)
//   ]
// );
