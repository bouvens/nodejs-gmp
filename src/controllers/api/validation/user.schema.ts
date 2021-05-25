import Joi from 'joi';
import { BodyValidatedRequest, validator } from './common';

const LETTERS_WITH_NUMBERS = new RegExp('^(\\d+[A-z]|[A-z]+\\d)[A-z\\d]*$');

const schema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string()
    .pattern(LETTERS_WITH_NUMBERS)
    .message('"password" must include letters WITH numbers')
    .required(),
  age: Joi.number().integer().min(4).max(130).required(),
});

const bodyValidator = validator.body(schema);
type ValidatedRequest = BodyValidatedRequest<typeof schema>;

export { ValidatedRequest, bodyValidator as validator };
