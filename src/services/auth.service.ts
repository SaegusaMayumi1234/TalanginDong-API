import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../config/config';
import db from '../storages/mongoDB/index';
import ApiError from '../utils/apiError';

export const register = async (email: string, password: string) => {
  const user = await db.userSchema.findOne({ email });
  if (user) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already exist');
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    await new db.userSchema({ email, username: email, password: hash }).save();
  } catch (error: any) {
    if (error.core === 11000) {
      throw new ApiError(httpStatus.CONFLICT, 'Email already exist');
    } else {
      throw error;
    }
  }
};

export const login = async (email: string, password: string) => {
  const user = await db.userSchema.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Email or password is invalid');
  }
  const token = jwt.sign(
    {
      email,
      username: user.username,
    },
    config.jwt.secret,
    { expiresIn: '1h' },
  );
  return {
    token,
    id: user._id,
    email: user.email,
    username: user.username,
  };
};
