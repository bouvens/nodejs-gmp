import Joi from 'joi';
import { BodyValidatedRequest, validator } from './common';

const schema = Joi.object({
  users: Joi.array().items(Joi.string().guid()).required(),
});

const bodyValidator = validator.body(schema);
type ValidatedRequest = BodyValidatedRequest<typeof schema>;

export { ValidatedRequest, bodyValidator as validator };
