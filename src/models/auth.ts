import { Model, ModelCtor } from 'sequelize';
import { IRefreshToken } from '../types';

export default class AuthModel {
  constructor(protected sequelizeModel: ModelCtor<Model<IRefreshToken>>) {}

  private static getPlain(refresh: Model<IRefreshToken> | null): IRefreshToken {
    if (refresh === null) {
      return null;
    }
    return refresh.get({ plain: true });
  }

  async addToken({ token, user, ip }: IRefreshToken): Promise<IRefreshToken> {
    return this.sequelizeModel.create({ token, user, ip }).then(AuthModel.getPlain);
  }

  async findToken(token: string): Promise<IRefreshToken> {
    const refresh: unknown = await this.sequelizeModel.findOne({ where: { token }, raw: true });
    return refresh as IRefreshToken;
  }

  async findTokenByUserId(id: string): Promise<IRefreshToken> {
    const refresh: unknown = await this.sequelizeModel.findOne({ where: { user: id }, raw: true });
    return refresh as IRefreshToken;
  }

  async updateToken(
    oldToken: IRefreshToken['token'],
    { token, ip }: Partial<IRefreshToken>,
  ): Promise<IRefreshToken> {
    return this.sequelizeModel
      .findOne({ where: { token: oldToken } })
      .then((refresh) => (refresh ? refresh.update({ token, ip }) : null))
      .then(AuthModel.getPlain);
  }
}
