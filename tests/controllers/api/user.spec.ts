import { NextFunction, Request, Response } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { autosuggestion } from '../../../src/controllers/api/user/autosuggestion';
import UserService from '../../../src/services/user';
import UserModel from 'models/user';
import { IUser } from 'types';

describe('User controller', () => {
  describe('autosuggestion', () => {
    const login = 'testLogin';
    const limit = 12;
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let userService: UserService;
    let users: IUser[];

    beforeEach(() => {
      users = [
        {
          id: '7d3b5688-dd09-4521-8d67-c24d17086482',
          login: 'test1',
          password: 'Password1',
          age: 38,
        },
        {
          id: 'a7ffd3ac-b59b-44ac-b06a-1fc829651252',
          login: 'test2',
          password: 'Password2',
          age: 39,
        },
      ];
      ({ res, next } = getMockRes());
      req = getMockReq({ query: { login, limit } });
      const dummyUserModel = <UserModel>{};
      userService = new UserService(dummyUserModel);
      userService.getAutoSuggest = jest.fn().mockResolvedValue(users);
      autosuggestion(userService)(req, res, next);
    });

    it('should call the service', () =>
      expect(userService.getAutoSuggest).toBeCalledWith(login, limit));

    it('should return users JSON', () => expect(res.json).toBeCalledWith(users));

    it('should call next', () => expect(next).toBeCalled());
  });
});
