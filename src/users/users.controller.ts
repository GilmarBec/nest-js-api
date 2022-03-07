import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnumRoles, User } from './entities/user.entity';
import { ResponseError } from '../exceptions/response.error';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { OnlyMyGuard } from '../auth/role/only.my.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(EnumRoles.ADMIN)
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => ({ ...user, password: undefined } as User));
  }

  @Get(':id')
  @UseGuards(OnlyMyGuard)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw ResponseError.USER_NOT_FOUND;
    }

    return { ...user, password: undefined } as User;
  }

  @Patch(':id')
  @UseGuards(OnlyMyGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = this.usersService.update(id, updateUserDto);
    if (!user) {
      throw ResponseError.USER_NOT_FOUND;
    }

    return user;
  }

  @Delete(':id')
  @UseGuards(OnlyMyGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
