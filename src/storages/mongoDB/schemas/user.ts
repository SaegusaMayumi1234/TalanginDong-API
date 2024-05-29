import { model, Schema } from 'mongoose';

interface IuserSchema {
  email: string;
  username: string;
  password: string;
}

export const userSchema = model(
  'User',
  new Schema<IuserSchema>({
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
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  }),
  'User',
);
