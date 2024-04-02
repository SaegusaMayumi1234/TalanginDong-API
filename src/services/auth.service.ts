import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

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
    if (error.code === 11000) {
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
      id: user._id,
      email,
      username: user.username,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expired },
  );
  const refreshToken = jwt.sign(
    {
      id: user._id,
      email,
      username: user.username,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpired },
  );
  return {
    token,
    refreshToken,
    id: user._id,
    email: user.email,
    username: user.username,
  };
};

export const refreshToken = async (refreshToken: string) => {
  let decodedPayload: JwtPayload;
  try {
    const decodedToken = jwt.verify(refreshToken, config.jwt.secret, { complete: true });
    decodedPayload = decodedToken.payload as JwtPayload;
  } catch (error: any) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh Token is Invalid');
  }
  const token = jwt.sign(
    {
      id: decodedPayload.id,
      email: decodedPayload.email,
      username: decodedPayload.username,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expired },
  );
  return {
    token,
  };
};
