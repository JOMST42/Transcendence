import { EventType } from '../enums';

export interface Event {
  type: EventType;
  payload?: any;
}
