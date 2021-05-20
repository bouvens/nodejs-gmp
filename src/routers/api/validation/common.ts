import {
  ContainerTypes,
  createValidator,
  ValidatedRequest,
  ValidatedRequestSchema,
} from 'express-joi-validation';

import Joi from 'joi';

export const validator = createValidator();

interface RequestSchema<S> extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Joi.extractType<S>;
}

export type BodyValidatedRequest<S> = ValidatedRequest<RequestSchema<S>>;
