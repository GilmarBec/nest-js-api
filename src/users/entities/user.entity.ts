export class User {
  email: string;
  firstName: string;
  _id: string;
  lastName: string;
  password: string;
  username: string;
  role: Roles;
}

export enum Roles {
  ADMIN = 'ADMIN',
  COMMON = 'COMMON',
}
