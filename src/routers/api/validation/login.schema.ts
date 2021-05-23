import Joi from 'joi';
import { BodyValidatedRequest, validator } from './common';

const schema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().required(),
});

const bodyValidator = validator.body(schema);
type ValidatedRequest = BodyValidatedRequest<typeof schema>;

export { ValidatedRequest, bodyValidator as validator };
