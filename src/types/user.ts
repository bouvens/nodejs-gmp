import { IBasicItem } from './common';

export interface OpenUserProps {
  login: string;
  password: string;
  age: number;
}

export type IUser = OpenUserProps & IBasicItem;
