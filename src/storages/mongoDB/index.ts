import mongoose from 'mongoose';

import * as logger from '../../utils/logger';
import { userSchema } from './schemas/user';

export default {
  userSchema,
  mongoose,
};

mongoose.connection.on('error', (error) => {
  logger.error('[Mongoose]', error);
});

mongoose.connection.on('connecting', () => {
  logger.info('[Mongoose] Connecting to MongoDB');
});

mongoose.connection.on('connected', () => {
  logger.info('[Mongoose] Connected to MongoDB');
});

mongoose.connection.on('disconnecting', () => {
  logger.info('[Mongoose] Disconnecting from MongoDB');
});

mongoose.connection.on('disconnected', () => {
  logger.info('[Mongoose] Disconnected from MongoDB');
});
