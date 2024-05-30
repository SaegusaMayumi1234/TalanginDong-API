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

export const cancel = {
  body: Joi.object().keys({
    recipientId: Joi.string().required(),
  }),
};

export const accept = {
  body: Joi.object().keys({
    requesterId: Joi.string().required(),
  }),
};

export const reject = {
  body: Joi.object().keys({
    requesterId: Joi.string().required(),
  }),
};

export const remove = {
  body: Joi.object().keys({
    friendId: Joi.string().required(),
  }),
};
