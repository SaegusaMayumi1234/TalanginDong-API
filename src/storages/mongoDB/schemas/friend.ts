import { model, Schema } from 'mongoose';

interface IfriendSchema {
  combineId: string;
  requesterId: string;
  recipientId: string;
  status: Number;
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
    status: {
      type: Number,
      enums: [
        0, //'requested',
        1, //'pending',
        2, //'friends'
      ],
    },
  }),
  'Friend',
);
