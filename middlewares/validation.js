const { celebrate, Joi } = require('celebrate');

const REGEXP_LINK = /https?:\/\/(www\.)?[A-Za-z\-._~:/?#[\]@!$&'()*+,;=]+#?/;

const avatarUpdateValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(REGEXP_LINK),
  }),
});

const profileUpdateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(REGEXP_LINK),
  }),
});

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(2),
    avatar: Joi.string().pattern(REGEXP_LINK),
  }),
});

module.exports = {
  avatarUpdateValidation,
  profileUpdateValidation,
  createCardValidation,
  createUserValidation,
};
