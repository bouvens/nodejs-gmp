import { OpenUserProps, IUser } from '../types';
import { UserModel } from '../models/user';
import CrudService from './crud';
import { InternalError } from '../models/error';

export default class UserService extends CrudService<OpenUserProps, UserModel> {
  getAutoSuggest(loginSubstring: string, limit: number): Promise<IUser[]> {
    return this.model
      .findByLogin(loginSubstring, limit)
      .then((users) => users || [])
      .catch((e) => {
        throw new InternalError(e.message, { args: { loginSubstring, limit } });
      });
  }
}
