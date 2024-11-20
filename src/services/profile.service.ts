import httpStatus from 'http-status';
import db from '../storages/mongoDB/index';
import ApiError from '../utils/apiError';

export const getProfile = async function getProfile(userId: string) {
  const user = await db.userSchema.findById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  return {
    id: userId,
    email: user.email,
    username: user.username,
  };
};
