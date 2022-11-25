export interface Friendship {
  requesterId?: number;
  adresseeId?: number;
  accepted?: boolean;
  adresseeBlocker?: boolean
  requesterBlocker?: boolean
}
