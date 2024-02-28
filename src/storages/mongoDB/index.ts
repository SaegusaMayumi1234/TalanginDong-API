import mongoose from 'mongoose';

import * as logger from '../../utils/logger';

export default {
  mongoose,
};

mongoose.connection.on('error', (error) => {
  logger.error('[Mongoose]', error);
});

mongoose.connection.on('connecting', () => {
  logger.info('[Mongoose] Connecting to MongoDB');
});

mongoose.connection.on('connected', (error) => {
  logger.info('[Mongoose] Connected to MongoDB');
});

mongoose.connection.on('disconnecting', (error) => {
  logger.info('[Mongoose] Disconnecting from MongoDB');
});

mongoose.connection.on('disconnected', (error) => {
  logger.info('[Mongoose] Disconnected from MongoDB');
});