type Includes<T, U extends T> = U;

export type User = {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
};

type ServiceProps = Includes<keyof User, 'id' | 'isDeleted'>;

export type OpenUserProps = Omit<User, ServiceProps>;
