import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../config/config';
import db from '../storages/mongoDB/index';
import ApiError from '../utils/apiError';

export const register = async (username: string, email: string, password: string) => {
  const users: any = await Promise.all([db.userSchema.findOne({ username }), db.userSchema.findOne({ email })]);
  if (users[0]) {
    throw new ApiError(httpStatus.CONFLICT, 'Username already exist');
  } else if (users[1]) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already exist');
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    await new db.userSchema({ username, email, password: hash }).save();
  } catch (error: any) {
    if (error.code === 11000) {
      const errKey = Object.keys(error.keyValue);
      if (errKey.includes('email')) {
        throw new ApiError(httpStatus.CONFLICT, 'Email already exist');
      } else if (errKey.includes('username')) {
        throw new ApiError(httpStatus.CONFLICT, 'Username already exist');
      }
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
    },
    config.jwt.secret + user.password,
    { expiresIn: config.jwt.expired },
  );
  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    config.jwt.secret + user.password,
    { expiresIn: config.jwt.refreshExpired },
  );
  return {
    token,
    refreshToken,
  };
};

export const refreshToken = async (refreshToken: string) => {
  try {
    const decodedPayload = JSON.parse(Buffer.from(refreshToken.split('.')[1], 'base64').toString('utf8'));
    const user = await db.userSchema.findById(decodedPayload.id);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
    }
    jwt.verify(refreshToken, config.jwt.secret + user.password);
    const token = jwt.sign(
      {
        id: decodedPayload.id,
      },
      config.jwt.secret + user.password,
      { expiresIn: config.jwt.expired },
    );
    return { token };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.NotBeforeError) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token expired');
    } else {
      throw error;
    }
  }
};
