import { model, Schema } from 'mongoose';

interface IfriendSchema {
  requester: string;
  recipient: string;
  accepted: Boolean;
}

export const friendSchema = model(
  'Friend',
  new Schema<IfriendSchema>({
    requester: {
      type: String,
      trim: true,
      required: true,
    },
    recipient: {
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
