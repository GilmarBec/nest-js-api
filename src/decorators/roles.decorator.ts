import { EnumRoles } from '../users/entities/user.entity';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: EnumRoles[]) => SetMetadata('roles', roles);
