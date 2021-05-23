import { UserModel } from '../models/user';
import { wrapErrorsAndLog } from '../models/error';

export default class LoginService {
  constructor(protected model: UserModel) {}

  @wrapErrorsAndLog
  async auth(login: string, password: string): Promise<string> {
    const user = await this.model.findByLogin(login);
    if (user && user.password === password) {
      return user.id;
    }
    return null;
  }
}
