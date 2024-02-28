import { model, Schema } from 'mongoose';

export const userSchema = model(
  'User',
  new Schema({
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  }),
  'User',
);
