import { NextFunction, Request, RequestHandler, Response } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';
import UserService from '../../../../src/services/user';
import { makeAutosuggestion } from '../../../../src/controllers/api/user/autosuggestion';
import { UserModel } from 'models/user';
import { IUser } from 'types';

describe('User controller', () => {
  const login = 'testLogin';
  const limit = 12;
  let autosuggestion: RequestHandler;
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let userService: UserService;
  let requestHandler: void;
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
    req = getMockReq();
    ({ res, next } = getMockRes());
    req = getMockReq({ query: { login, limit } });
    const dummyUserModel = <UserModel>{};
    userService = new UserService(dummyUserModel);
    userService.getAutoSuggest = jest.fn().mockReturnValue(users);
    autosuggestion = makeAutosuggestion(userService);
    requestHandler = autosuggestion(req, res, next);
  });

  it('should call the service', () =>
    expect(userService.getAutoSuggest).toBeCalledWith(login, limit));

  it('should return users JSON', () => expect(res.json).toBeCalledWith(users));

  it('should call next', () => expect(next).toBeCalled());

  it('should return void promise', () => expect(requestHandler).resolves.toEqual(undefined));
});
