import { User } from './user.model';

export interface Room {
  id?: number;
  name?: string;
  users?: User[];
}
