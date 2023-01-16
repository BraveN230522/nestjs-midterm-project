import * as Joi from 'joi';

const port = 1999;
// const portMail = 587;

export const envSchema: Joi.ObjectSchema = Joi.object({
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PORT: Joi.string().required(),
  SERVER_PORT: Joi.number().default(port),

  // SMTP_SERVER: Joi.string().required(),
  // SMTP_PORT: Joi.number().default(portMail),
  // SMTP_USER: Joi.string().required(),
  // SMTP_PASSWORD: Joi.string().required(),
  // WEB_BASE_ADMIN_URL: Joi.string().required(),
  // WEB_BASE_USER_URL: Joi.string().required(),
});
