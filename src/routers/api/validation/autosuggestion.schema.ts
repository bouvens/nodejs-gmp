import Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';
import { validator } from './common';

const schema = Joi.object({
  login: Joi.string().required(),
  limit: Joi.number().integer().min(1).required(),
});

interface RequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof schema>;
}

type QueryValidatedRequest = ValidatedRequest<RequestSchema>;
const queryValidator = validator.query(schema);

export { QueryValidatedRequest as ValidatedRequest, queryValidator as validator };
