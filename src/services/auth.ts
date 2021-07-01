import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import UserModel from '../models/user';
import AuthModel from '../models/auth';
import config from '../config';
import { ITokenPair, ITokenPayload, IUser } from '../types';
import { wrapErrorsAndLogSafely } from './error';

export default class AuthService {
  constructor(protected userModel: UserModel, protected authModel: AuthModel) {}

  private static makeRefreshToken(): ITokenPair['refresh'] {
    return crypto.randomBytes(config.refreshTokenSize).toString('hex');
  }

  private static makeAccessToken(userId: IUser['id']): ITokenPair['access'] {
    const payload: ITokenPayload = { sub: userId };
    return jwt.sign(payload, config.jwtSecret, { expiresIn: config.accessTokenExp });
  }

  @wrapErrorsAndLogSafely
  async login(login: string, password: string, ip: string): Promise<ITokenPair> {
    const user = await this.userModel.findByLogin(login);
    if (!user || user.password !== password) {
      return null;
    }

    const refresh = AuthService.makeRefreshToken();
    const previous = await this.authModel.findTokenByUserId(user.id);
    if (previous) {
      await this.authModel.updateToken(previous.token, { token: refresh, ip });
    } else {
      await this.authModel.addToken({ token: refresh, user: user.id, ip });
    }
    return {
      refresh,
      access: AuthService.makeAccessToken(user.id),
    };
  }

  @wrapErrorsAndLogSafely
  async refresh(refreshToken: string, ipAddress: string): Promise<ITokenPair> {
    const token = await this.authModel.findToken(refreshToken);
    if (!token) {
      return null;
    }
    const newToken = AuthService.makeRefreshToken();
    await this.authModel.updateToken(refreshToken, { token: newToken, ip: ipAddress });
    return {
      refresh: newToken,
      access: AuthService.makeAccessToken(token.user),
    };
  }

  @wrapErrorsAndLogSafely
  authenticate<F>(token: string): Promise<ITokenPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.jwtSecret, (err, decoded: ITokenPayload) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
