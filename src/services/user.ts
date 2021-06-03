import { OpenUserProps, IUser } from '../types';
import { UserModel } from '../models/user';
import { wrapErrorsAndLog } from './error';
import CrudService from './crud';

export default class UserService extends CrudService<OpenUserProps, UserModel> {
  @wrapErrorsAndLog
  async getAutoSuggest(loginSubstring: string, limit: number): Promise<IUser[]> {
    const users = await this.model.autoSuggest(loginSubstring, limit);
    return users || [];
  }
}
