
export enum EventType {
  Collision = 'COLLISION',
  Score = 'SCORE',
  Victory = 'VICTORY',
}

export interface Event {
  type: EventType;
  payload?: any;
}
