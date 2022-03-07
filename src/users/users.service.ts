import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnumRoles, User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel({
      ...createUserDto,
      role: EnumRoles.COMMON,
    });

    return createdUser.save();
  }

  async findAll() {
    return this.userModel.find();
  }

  async findOneById(id: string) {
    return this.userModel.findById(id);
  }

  async findOneByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  async remove(id: string) {
    return this.userModel.findByIdAndRemove(id);
  }
}
