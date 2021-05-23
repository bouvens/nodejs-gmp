import { OpenUserProps, IUser } from '../types';
import { UserModel } from '../models/user';
import { wrapErrorsAndLog } from '../models/error';
import CrudService from './crud';

export default class UserService extends CrudService<OpenUserProps, UserModel> {
  @wrapErrorsAndLog
  async getAutoSuggest(loginSubstring: string, limit: number): Promise<IUser[]> {
    const users = await this.model.autosuggest(loginSubstring, limit);
    return users || [];
  }
}
