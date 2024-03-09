import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development').required(),
    PORT: Joi.number().min(1024).max(65535).default(3000),
    PROXIED: [Joi.boolean().invalid(true).required(), Joi.number().required()],
    MONGODB_URI: Joi.string()
      .uri({ scheme: ['mongodb', 'mongodb+srv'] })
      .required(),
    MONGODB_NAME: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRED: Joi.string().required(),
    AWS_REGION: Joi.string().required(),
    AWS_PROFILE: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`ENV validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  proxied: envVars.PROXIED,
  mongodb: {
    uri: envVars.MONGODB_URI,
    name: envVars.MONGODB_NAME,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expired: envVars.JWT_EXPIRED,
  },
  aws: {
    region: envVars.AWS_REGION,
    profile: envVars.AWS_PROFILE,
  },
};
