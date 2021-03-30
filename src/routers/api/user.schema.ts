import {
  ContainerTypes,
  createValidator,
  ValidatedRequest,
  ValidatedRequestSchema,
} from 'express-joi-validation';
import * as Joi from 'joi';

const LETTERS_WITH_NUMBERS = new RegExp('^(\\d+[A-z]|[A-z]+\\d)[A-z\\d]*$');

const validator = createValidator();

const userSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string()
    .pattern(LETTERS_WITH_NUMBERS)
    .message('"password" must include letters WITH numbers')
    .required(),
  age: Joi.number().integer().min(4).max(130).required(),
});

export interface UserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    login: string;
    password: string;
    age: number;
  };
}

export const userValidator = validator.body(userSchema);
export type ValidatedUserRequest = ValidatedRequest<UserRequestSchema>;
