import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';
import { wrapErrorsAndLogSafely } from '../models/error';
import config from '../config';
import { IPayload } from '../types/auth';

export default class AuthService {
  constructor(protected model: UserModel) {}

  @wrapErrorsAndLogSafely
  async login(login: string, password: string): Promise<string> {
    const user = await this.model.findByLogin(login);
    const payload: IPayload = { sub: user.id };
    if (user && user.password === password) {
      return jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
    }
    return null;
  }

  @wrapErrorsAndLogSafely
  authenticate<F>(token: string): Promise<IPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.jwtSecret, (err, decoded: IPayload) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
