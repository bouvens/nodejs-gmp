import { OpenUserProps, IUser } from '../types';
import { UserModel } from '../models/user';
import CrudService from './crud';

export default class UserService extends CrudService<OpenUserProps, UserModel> {
  async getAutoSuggest(loginSubstring: string, limit: number): Promise<IUser[]> {
    const users = await this.model.findByLogin(loginSubstring, limit);
    return users || [];
  }
}
