import Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';
import { Permission, permissionList } from '../../../types';
import { validator } from './common';

const schema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array()
    .items(Joi.string().valid(...permissionList))
    .required(),
});

const bodyValidator = validator.body(schema);

interface RequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    permissions: Permission[];
  };
}
type Request = ValidatedRequest<RequestSchema>;

export { Request as ValidatedRequest, bodyValidator as validator };
