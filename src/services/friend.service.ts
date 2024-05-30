import httpStatus from 'http-status';
import mongoose from 'mongoose';

import db from '../storages/mongoDB/index';
import ApiError from '../utils/apiError';

export const list = async (userId: string) => {
  const friendListId = (await db.friendSchema.find({ requesterId: userId, accepted: true })).map(
    (value) => new mongoose.Types.ObjectId(value.requesterId),
  );
  if (friendListId.length === 0) {
    return [];
  }
  const friendList = await db.userSchema.find({
    _id: {
      $in: friendListId,
    },
  });
  return friendList;
};

export const search = async (userId: string, search: string) => {
  const friendListId = (await db.friendSchema.find({ requesterId: userId })).map((value) => new mongoose.Types.ObjectId(value.recipientId));
  friendListId.push(new mongoose.Types.ObjectId(userId));
  const userList = await db.userSchema
    .find({
      _id: {
        $nin: friendListId,
      },
      username: new RegExp(`^${search}`),
    })
    .sort({ username: 1 });
  return userList.map((value) => ({ id: value._id.toString(), username: value.username }));
};

export const request = async (requesterId: string, recipientId: string) => {
  try {
    await new db.friendSchema({
      combineId: `${requesterId}-${recipientId}`,
      requesterId,
      recipientId,
      accepted: false,
    }).save();
  } catch (error: any) {
    // need testing
    if (error.code === 11000) {
      const errKey = Object.keys(error.keyValue);
      if (errKey.includes('combineId')) {
        throw new ApiError(httpStatus.CONFLICT, 'Already requested');
      }
    }
    throw error;
  }
};

export const cancel = async (requesterId: string, recipientId: string) => {
  const deleteQuery = await db.friendSchema.deleteOne({ requesterId, recipientId });
  if (deleteQuery.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Already cancelled');
  }
};

export const requestList = async (requesterId: string) => {
  const requestListId = (await db.friendSchema.find({ requesterId, accepted: false })).map((value) => new mongoose.Types.ObjectId(value.recipientId));
  if (requestListId.length === 0) return [];
  const requestList = await db.userSchema.find({
    _id: {
      $in: requestListId,
    },
  });
  return requestList.map((value) => ({ id: value._id.toString(), username: value.username }));
};

// can be improved
export const accept = async (requesterId: string, recipientId: string) => {
  if (!(await db.friendSchema.find({ requester: requesterId, recipient: recipientId }))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Friend data not found');
  }
  await db.friendSchema.findOneAndUpdate({ requester: requesterId, recipient: recipientId, accepted: false }, { accepted: true });
};

export const reject = async (requesterId: string, recipientId: string) => {
  if (!(await db.friendSchema.find({ requester: requesterId, recipient: recipientId }))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Friend data not found');
  }
  try {
    await db.friendSchema.deleteOne({ requesterId, recipientId });
  } catch (error: any) {
    // need improvement and testing
    if (error.code) {
      throw error;
    }
    throw error;
  }
};

export const remove = async (requesterId: string, recipientId: string) => {
  if (!(await db.friendSchema.find({ requester: requesterId, recipient: recipientId }))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Friend data not found');
  }
  try {
    await db.friendSchema.deleteOne({ requesterId, recipientId });
  } catch (error: any) {
    // need improvement and testing
    if (error.code) {
      throw error;
    }
    throw error;
  }
};
