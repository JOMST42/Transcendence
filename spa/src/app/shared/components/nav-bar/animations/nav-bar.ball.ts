import {

  animate,
  style,
  animation,
} from '@angular/animations';

export const ballAnimation = animation([
  style({
    left: '{{ leftBall }}',
    top: '{{ topBall }}',
  }),
  animate('{{ time }}'),
]);
