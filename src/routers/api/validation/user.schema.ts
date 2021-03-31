import * as Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';
import { validator } from './common';

const LETTERS_WITH_NUMBERS = new RegExp('^(\\d+[A-z]|[A-z]+\\d)[A-z\\d]*$');

const schema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string()
    .pattern(LETTERS_WITH_NUMBERS)
    .message('"password" must include letters WITH numbers')
    .required(),
  age: Joi.number().integer().min(4).max(130).required(),
});

interface RequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Joi.extractType<typeof schema>;
}

type BodyValidatedRequest = ValidatedRequest<RequestSchema>;
const bodyValidator = validator.body(schema);

export { BodyValidatedRequest as ValidatedRequest, bodyValidator as validator };
