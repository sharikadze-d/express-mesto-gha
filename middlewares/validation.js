const { celebrate, Joi } = require('celebrate');

const REGEXP_LINK = /https?:\/\/(www\.)?[0-9A-Za-z\-._~:/?#[\]@!$&'()*+,;=]+\.[a-zA-Z]{2,8}[0-9A-Za-z\-._~:/?#[\]@!$&'()*+,;=]*/;

const avatarUpdateValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(REGEXP_LINK),
  }),
});

const profileUpdateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
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

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(2),
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  avatarUpdateValidation,
  profileUpdateValidation,
  createCardValidation,
  createUserValidation,
  loginValidation,
  userIdValidation,
  cardIdValidation,
};
