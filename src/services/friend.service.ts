import httpStatus from 'http-status';
import mongoose from 'mongoose';

import db from '../storages/mongoDB/index';
import ApiError from '../utils/apiError';

export const list = async (userId: string) => {
  const friendListId = (await db.friendSchema.find({ requester: userId, accepted: true })).map(
    (value) => new mongoose.Types.ObjectId(value.requester),
  );
  const friendList = await db.userSchema.find({
    _id: {
      $in: friendListId,
    },
  });
  return friendList;
};

export const search = async (userId: string, search: string) => {
  const friendListId = (await db.friendSchema.find({ requester: userId, accepted: true })).map(
    (value) => new mongoose.Types.ObjectId(value.recipient),
  );
  const userList = await db.userSchema
    .find({
      _id: {
        $nin: friendListId,
      },
      username: new RegExp(`^${search}`),
    })
    .sort({ username: 1 });
  return userList;
};

export const request = async (requesterId: string, recipientId: string) => {
  if (await db.friendSchema.find({ requester: requesterId, recipient: recipientId })) {
    throw new ApiError(httpStatus.CONFLICT, 'Already requested');
  }
  return [];
};

// export const cancel = async (requesterId: string, recipientId: string) => {};

// export const requestList = async (requesterId: string) => {};

// export const accept = async (requesterId: string, friendId: string) => {};

// export const reject = async (requesterId: string, friendId: string) => {};

// export const remove = async (recipientId: string) => {};
