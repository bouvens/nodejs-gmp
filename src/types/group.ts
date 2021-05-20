import { IBasicItem } from './common';

export enum Permission {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  SHARE = 'SHARE',
  UPLOAD_FILES = 'UPLOAD_FILES',
}

export const permissionList: string[] = Object.values(Permission);

export interface OpenGroupProps {
  name: string;
  permissions: Permission[];
}

export type IGroup = OpenGroupProps & IBasicItem;
