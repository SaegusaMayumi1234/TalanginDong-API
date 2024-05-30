import Joi from 'joi';

export const search = {
  query: Joi.object().keys({
    search: Joi.string().required(),
  }),
};
