import { NextFunction, Request, Response } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';
import GroupService from '../../../src/services/group';
import { IGroup, IUser, Permission } from '../../../src/types';
import { addUsersToGroup } from '../../../src/controllers/api/group/add-users-to-group';
import { readAll } from '../../../src/controllers/api/group/read-all';
import GroupModel from 'models/group';
import UsersGroupModel from 'models/users_groups';

describe('Group controller', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let groupService: GroupService;
  let groups: IGroup[];

  beforeEach(() => {
    groups = [
      {
        id: '06cd5e88-1d7d-4119-9265-9eaca68ca580',
        name: 'admins',
        permissions: [
          Permission.READ,
          Permission.WRITE,
          Permission.DELETE,
          Permission.SHARE,
          Permission.UPLOAD_FILES,
        ],
      },
      {
        id: '3427760e-6315-4955-8327-54b2a4f7df3e',
        name: 'anonymous',
        permissions: [Permission.READ],
      },
    ];
    ({ res, next } = getMockRes());
    const dummyGroupModel = <GroupModel>{};
    const dummyUsersGroupsModel = <UsersGroupModel>{};
    groupService = new GroupService(dummyGroupModel, dummyUsersGroupsModel);
  });

  describe('read all', () => {
    beforeEach(() => {
      req = getMockReq();
      groupService.getAll = jest.fn().mockReturnValue(groups);
      readAll(groupService)(req, res, next);
    });

    it('should call the service', () => expect(groupService.getAll).toBeCalledWith());

    it('should return groups JSON', () => expect(res.json).toBeCalledWith(groups));

    it('should call next', () => expect(next).toBeCalled());
  });

  describe('add users to a group', () => {
    const groupId = '3427760e-6315-4955-8327-54b2a4f7df3e';
    let users: IUser['id'][];

    beforeEach(() => {
      users = ['7d3b5688-dd09-4521-8d67-c24d17086482', 'a7ffd3ac-b59b-44ac-b06a-1fc829651252'];
      groupService.addUsersToGroup = jest.fn().mockReturnValue(users);
      req = getMockReq({ params: { id: groupId }, body: { users } });
      addUsersToGroup(groupService)(req, res, next);
    });

    it('should call the service', () =>
      expect(groupService.addUsersToGroup).toBeCalledWith(groupId, users));

    it('should return successful status', () =>
      expect(res.json).toBeCalledWith({ status: 'success' }));

    it('should call next', () => expect(next).toBeCalled());
  });
});
