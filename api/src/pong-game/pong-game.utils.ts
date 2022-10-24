import { Vector3 } from './interfaces';

// return p1 if the symbol is invalid. Symbol: + - * /
export function calculateVect3(
  v1: Vector3,
  v2: Vector3 | number,
  symbol: string,
): Vector3 {
  let n1: number;
  let n2: number;
  if (typeof v2 !== 'number') {
    n1 = v2.x;
    n2 = v2.y;
  } else {
    n1 = v2;
    n2 = v2;
  }
  let result: Vector3 = v1;
  switch (symbol) {
    case '+':
      result = { x: v1.x + n1, y: v1.y + n2 };
      break;
    case '-':
      result = { x: v1.x - n1, y: v1.y - n2 };
      break;
    case '*':
      result = { x: v1.x * n1, y: v1.y * n2 };
      break;
    case '/':
      result = { x: v1.x / n1, y: v1.y / n2 };
      break;
  }
  return result;
}

export function applyFPS(n: number): number {
  return n * (1 / 60);
}

export function checkCollisionBox(
  pos1: Vector3,
  size1: Vector3,
  pos2: Vector3,
  size2: Vector3,
): Vector3 | undefined {
  const max_x1 = pos1.x + size1.x;
  const max_y1 = pos1.y + size1.y;
  const max_x2 = pos2.x + size2.x;
  const max_y2 = pos2.y + size2.y;
  const col_pos: Vector3 = { x: -1, y: -1 };

  if (pos2.x > pos1.x && pos2.x < max_x1) col_pos.x = pos2.x;
  else if (pos1.x > pos2.x && pos1.x < max_x2) col_pos.x = pos1.x;
  if (pos2.y > pos1.y && pos2.y < max_y1) col_pos.y = pos2.y;
  else if (pos1.y > pos2.y && pos1.y < max_y2) col_pos.y = pos1.y;

  if (col_pos.x === -1 || col_pos.y === -1) return undefined;
  return col_pos;
}

// export function checkIntersection(
//   line1: { p1: Vector3; p2: Vector3; a: number },
//   line2: { p1: Vector3; p2: Vector3; a: number },
// ): Vector3 | undefined {
//   let inter: Vector3 = { x: 0, y: 0 };
//   let a: number;
//   let b: number;

//   inter = { x: 0, y: 0 };
//   inter.x = line2.p1.x;

//   // Check if intersection is in the range of p1 and p2
//   if (
//     (inter.x >= line1.p1.x && inter.x <= line1.p2.x) ||
//     (inter.x >= line1.p2.x && inter.x <= line1.p1.x)
//   ) {
//     b = a * line1.p1.x - line1.p1.y;

//     inter.x = line2.p1.x;
//     inter.y = -(-a * line2.p1.x + b);
//     if (line2.p1.y <= inter.y && line2.p2.y >= inter.y) {
//       return inter;
//     }
//   }
//   return undefined;
// }
