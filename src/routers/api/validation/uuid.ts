import Joi from 'joi';
import { validator } from './common';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const schema = Joi.object({
  id: Joi.string().pattern(UUID).message('ID should be a valid UUID').required(),
});

const paramsValidator = validator.params(schema);

export { paramsValidator as validator };
