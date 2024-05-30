import { model, Schema } from 'mongoose';

interface IfriendSchema {
  combineId: string;
  requesterId: string;
  recipientId: string;
  accepted: Boolean;
}

export const friendSchema = model(
  'Friend',
  new Schema<IfriendSchema>({
    combineId: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    requesterId: {
      type: String,
      trim: true,
      required: true,
    },
    recipientId: {
      type: String,
      trim: true,
      required: true,
    },
    accepted: {
      type: Boolean,
      required: true,
    },
  }),
  'Friend',
);
