import { model, Schema } from 'mongoose';

export const userSchema = model(
  'User',
  new Schema({
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    salt: {
      type: String,
      trim: true,
      required: true,
    },
  }),
  'User',
);
