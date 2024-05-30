import Joi from 'joi';

export const search = {
  query: Joi.object().keys({
    search: Joi.string().required(),
  }),
};

export const request = {
  body: Joi.object().keys({
    recipientId: Joi.string().required(),
  }),
};
