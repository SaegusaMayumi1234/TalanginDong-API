import Joi from 'joi';

export const scan = {
  body: Joi.object().keys({
    bytes: Joi.string().base64().required(),
  }),
};
