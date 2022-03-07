import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnumRoles, User } from './entities/user.entity';
import { Model } from 'mongoose';
import { ResponseError } from '../exceptions/response.error';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (await this.findOneByUsername(createUserDto.username)) {
      throw ResponseError.USERNAME_ALREADY_IN_USE;
    }

    const createdUser = new this.userModel({
      ...createUserDto,
      password: this.hashPassword(createUserDto.password),
      role: EnumRoles.COMMON,
    });

    return createdUser.save().then(this.cleanSensibleData);
  }

  async findAll() {
    return this.userModel
      .find()
      .then((users) => users.map(this.cleanSensibleData));
  }

  async findOneById(id: string) {
    return this.userModel.findById(id).then((user) => {
      if (!user) throw ResponseError.USER_NOT_FOUND;
      return this.cleanSensibleData(user);
    });
  }

  async findOneByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUserRole) {
    if (updateUserDto.username) {
      const user = await this.findOneByUsername(updateUserDto.username);

      if (user && user._id !== id) {
        throw ResponseError.USERNAME_ALREADY_IN_USE;
      }
    }

    const updateUser: Partial<User> = {
      email: updateUserDto.email,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      password: updateUserDto.password,
      username: updateUserDto.username,
    };

    if (updateUserDto.role && currentUserRole === EnumRoles.ADMIN) {
      updateUser.role = updateUserDto.role;
    }

    if (updateUser.password) {
      updateUser.password = this.hashPassword(updateUserDto.password);
    }

    return await this.userModel
      .findByIdAndUpdate(id, updateUser)
      .then((user) => {
        if (!user) throw ResponseError.USER_NOT_FOUND;
        return {
          _id: user._id,
          email: updateUser.email ?? user.email,
          firstName: updateUser.firstName ?? user.firstName,
          lastName: updateUser.lastName ?? user.lastName,
          username: updateUser.username ?? user.username,
          role: updateUser.role ?? user.role,
        } as Partial<User>;
      });
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndRemove(id).then((user) => {
      if (!user) throw ResponseError.USER_NOT_FOUND;
      return this.cleanSensibleData(user);
    });
  }

  cleanSensibleData(user: User): Partial<User> {
    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: user.role,
    };
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, Number(process.env.BCRYPT_SALT_ROUNDS));
  }

  verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
