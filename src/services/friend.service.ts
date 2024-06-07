import httpStatus from 'http-status';
import mongoose from 'mongoose';

import db from '../storages/mongoDB/index';
import ApiError from '../utils/apiError';

export const list = async (userId: string) => {
  const friendListId = (await db.friendSchema.find({ requesterId: userId, status: 2 })).map(
    (value) => new mongoose.Types.ObjectId(value.recipientId),
  );
  if (friendListId.length === 0) {
    return [];
  }
  const userList = await db.userSchema
    .find({
      _id: {
        $in: friendListId,
      },
    })
    .sort({ username: 1 });
  return userList.map((value) => ({ id: value._id.toString(), username: value.username }));
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
    const res1 = await db.friendSchema.updateOne(
      {
        requesterId,
        recipientId,
      },
      {
        $setOnInsert: {
          combineId: `${requesterId}-${recipientId}`,
          requesterId,
          recipientId,
          status: 0,
        },
      },
      {
        upsert: true,
      },
    );
    if (res1.matchedCount > 0) {
      throw new ApiError(httpStatus.CONFLICT, 'Already requested');
    }
    const res2 = await db.friendSchema.findOneAndUpdate(
      {
        requesterId: recipientId,
        recipientId: requesterId,
      },
      {
        $setOnInsert: {
          combineId: `${recipientId}-${requesterId}`,
          requesterId: recipientId,
          recipientId: requesterId,
          status: 1,
        },
      },
      {
        upsert: true,
      },
    );
    if (res2) {
      if (res2.status === 1) {
        throw new ApiError(httpStatus.CONFLICT, 'Already requested');
      } else if (res2.status === 0) {
        await db.friendSchema.findOneAndUpdate(
          {
            requesterId: recipientId,
            recipientId: requesterId,
          },
          {
            status: 1,
          },
        );
      }
    }
  } catch (error: any) {
    if (error.code === 11000) {
      if (error.message.includes('combineId')) {
        throw new ApiError(httpStatus.CONFLICT, 'Already requested');
      }
    }
    throw error;
  }
};

export const cancel = async (requesterId: string, recipientId: string) => {
  const deleteQuery = await db.friendSchema.deleteMany({
    $or: [
      {
        requesterId,
        recipientId,
        status: 0,
      },
      {
        requesterId: recipientId,
        recipientId: requesterId,
        status: 1,
      },
    ],
  });
  if (deleteQuery.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Friend request not found');
  }
};

export const pending = async (requesterId: string) => {
  const pendingList = await db.friendSchema.find({
    $or: [
      {
        requesterId,
      },
    ],
    status: {
      $ne: 2,
    },
  });
  if (pendingList.length === 0) return [];
  const pendingListId = pendingList.map((value) => new mongoose.Types.ObjectId(value.recipientId));
  const userList = await db.userSchema
    .find({
      _id: {
        $in: pendingListId,
      },
    })
    .sort({ username: 1 });
  return pendingList
    .map((value) => {
      const user = userList.find((user) => user._id.toString() === value.recipientId);
      return {
        id: value.recipientId,
        username: user?.username ?? 'unknown-user',
        status: value.status,
      };
    })
    .sort((a, b) => b.status.valueOf() - a.status.valueOf() || a.username.localeCompare(b.username));
};

export const accept = async (requesterId: string, recipientId: string) => {
  const updateQuery = await db.friendSchema.updateOne(
    {
      requesterId,
      recipientId,
      status: 0,
    },
    { status: 2 },
  );
  if (updateQuery.matchedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Friend request not found');
  } else if (updateQuery.matchedCount > 0 && updateQuery.modifiedCount === 0) {
    throw new ApiError(httpStatus.CONFLICT, 'Already accepted');
  }
  await db.friendSchema.updateOne(
    {
      requesterId: recipientId,
      recipientId: requesterId,
      $or: [
        {
          status: 0,
        },
        {
          status: 1,
        },
      ],
    },
    { status: 2 },
  );
};

export const reject = async (requesterId: string, recipientId: string) => {
  const deleteQuery = await db.friendSchema.deleteMany({
    $or: [
      {
        requesterId,
        recipientId,
        status: 0,
      },
      {
        requesterId: recipientId,
        recipientId: requesterId,
        status: 1,
      },
    ],
  });
  if (deleteQuery.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Friend request not found');
  }
};

export const remove = async (userId: string, friendId: string) => {
  const deleteQuery = await db.friendSchema.deleteMany({
    $or: [
      {
        requesterId: userId,
        recipientId: friendId,
        status: 2,
      },
      {
        requesterId: friendId,
        recipientId: userId,
        status: 2,
      },
    ],
  });
  if (deleteQuery.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Friend not found');
  }
};
