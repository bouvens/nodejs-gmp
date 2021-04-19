import { Includes } from './common';

export enum Permission {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  SHARE = 'SHARE',
  UPLOAD_FILES = 'UPLOAD_FILES',
}

export const permissionList: string[] = Object.values(Permission);

export type Group = {
  id: string;
  name: string;
  permissions: Permission[];
};

type ServiceProps = Includes<keyof Group, 'id'>;

export type OpenGroupProps = Omit<Group, ServiceProps>;
