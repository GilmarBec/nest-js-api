export class User {
  email: string;
  firstName: string;
  _id: string;
  lastName: string;
  password: string;
  username: string;
  role: EnumRoles;
}

export enum EnumRoles {
  ADMIN = 'ADMIN',
  COMMON = 'COMMON',
}
