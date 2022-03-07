import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { EnumRoles } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  role?: EnumRoles;
}
