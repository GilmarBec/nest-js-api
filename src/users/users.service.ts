import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnumRoles, User } from './entities/user.entity';
import { Model } from 'mongoose';
import { ResponseError } from '../exceptions/response.error';

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
      role: EnumRoles.COMMON,
    });

    return createdUser.save();
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.username) {
      const user = await this.findOneByUsername(updateUserDto.username);

      if (user && user._id !== id) {
        throw ResponseError.USERNAME_ALREADY_IN_USE;
      }
    }

    return await this.userModel
      .findByIdAndUpdate(id, updateUserDto)
      .then((user) => {
        if (!user) throw ResponseError.USER_NOT_FOUND;
        return { ...this.cleanSensibleData(user), ...updateUserDto };
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
}
