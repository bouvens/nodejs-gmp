import { NextFunction, Request, Response } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { create } from '../../../src/controllers/api/crud/create';
import { read } from '../../../src/controllers/api/crud/read';
import CrudService from '../../../src/services/crud';
import UserModel from 'models/user';
import { IUser, OpenUserProps } from 'types';
import { IBasicItem } from 'types/common';
import { update } from '../../../src/controllers/api/crud/update';
import { deleteHandler } from '../../../src/controllers/api/crud/delete';

describe('CRUD controller', () => {
  const id: IBasicItem['id'] = '3427760e-6315-4955-8327-54b2a4f7df3e';
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let crudService: CrudService<OpenUserProps>;
  let user: IUser;

  beforeEach(() => {
    user = {
      id,
      login: 'test1',
      password: 'Password1',
      age: 38,
    };
    ({ res, next } = getMockRes());
    const dummyUserModel = <UserModel>{};
    crudService = new CrudService(dummyUserModel);
  });

  describe('create', () => {
    beforeEach(() => {
      req = getMockReq({ originalUrl: '/test/url', body: user });
      crudService.create = jest.fn().mockResolvedValue(id);
      create(crudService)(req, res, next);
    });

    it('should call the service', () => expect(crudService.create).toBeCalledWith(user));

    it('should return the correct status', () => expect(res.status).toBeCalledWith(201));

    it('should set the location header', () =>
      expect(res.set).toBeCalledWith('Location', '/test/url/3427760e-6315-4955-8327-54b2a4f7df3e'));

    it('should return id', () => expect(res.json).toBeCalledWith({ id }));

    it('should call next', () => expect(next).toBeCalled());
  });

  describe('read', () => {
    beforeEach(() => {
      req = getMockReq({ params: { id } });
    });

    describe('happy path', () => {
      beforeEach(() => {
        crudService.getById = jest.fn().mockResolvedValue(user);
        read(crudService)(req, res, next);
      });

      it('should call the service', () => expect(crudService.getById).toBeCalledWith(id));

      it('should return user object', () => expect(res.json).toBeCalledWith(user));

      it('should call next', () => expect(next).toBeCalled());
    });

    describe('unhappy path', () => {
      beforeEach(() => {
        crudService.getById = jest.fn().mockResolvedValue(null);
        read(crudService)(req, res, next);
      });

      it('should call the service', () => expect(crudService.getById).toBeCalledWith(id));

      it('should not respond', () => expect(res.json).not.toBeCalled());

      it('should call next with error', () =>
        expect(next).toBeCalledWith(
          Error('No items with id: 3427760e-6315-4955-8327-54b2a4f7df3e'),
        ));
    });
  });

  describe('update', () => {
    beforeEach(() => {
      req = getMockReq({ params: { id }, body: user });
      crudService.update = jest.fn().mockResolvedValue(user);
      update(crudService)(req, res, next);
    });

    it('should call the service', () => expect(crudService.update).toBeCalledWith(id, user));

    it('should return updated object', () => expect(res.json).toBeCalledWith(user));

    it('should call next', () => expect(next).toBeCalled());
  });

  describe('delete', () => {
    beforeEach(() => {
      req = getMockReq({ params: { id } });
    });

    describe('happy path', () => {
      beforeEach(() => {
        crudService.delete = jest.fn().mockResolvedValue(user);
        deleteHandler(crudService)(req, res, next);
      });

      it('should call the service', () => expect(crudService.delete).toBeCalledWith(id));

      it('should return success status', () =>
        expect(res.json).toBeCalledWith({
          message: 'Deleted successfully: 3427760e-6315-4955-8327-54b2a4f7df3e',
        }));

      it('should call next', () => expect(next).toBeCalled());
    });

    describe('unhappy path', () => {
      beforeEach(() => {
        crudService.delete = jest.fn().mockResolvedValue(null);
        deleteHandler(crudService)(req, res, next);
      });

      it('should call the service', () => expect(crudService.delete).toBeCalledWith(id));

      it('should not respond', () => expect(res.json).not.toBeCalled());

      it('should call next with error', () => expect(next).toBeCalledWith(Error("Can't delete")));
    });
  });
});
