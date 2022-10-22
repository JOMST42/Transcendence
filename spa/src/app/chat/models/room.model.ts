import { User } from '../../user/models';

export interface Room {
  id?: number;
  name?: string;
  users?: User[];
}
