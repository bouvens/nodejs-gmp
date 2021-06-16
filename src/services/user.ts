import { OpenUserProps, IUser } from '../types';
import CrudService from './crud';
import UserModel from '../models/user';
import { wrapErrorsAndLog, wrapErrorsAndLogSafely } from './error';
import { IBasicItem } from '../types/common';
import AuthService from './auth';

export default class UserService extends CrudService<OpenUserProps, UserModel> {
  constructor(protected model: UserModel) {
    super(model);
  }

  @wrapErrorsAndLogSafely
  async create(props: OpenUserProps): Promise<IBasicItem['id']> {
    return this.model.add({
      ...props,
      password: AuthService.hashPassword(props.password),
    });
  }

  @wrapErrorsAndLog
  async getAutoSuggest(loginSubstring: string, limit: number): Promise<IUser[]> {
    const users = await this.model.autoSuggest(loginSubstring, limit);
    return users || [];
  }
}
