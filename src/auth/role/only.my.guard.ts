import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { EnumRoles } from '../../users/entities/user.entity';

@Injectable()
export class OnlyMyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user.role === EnumRoles.ADMIN) {
      return true;
    }

    const requestedId = request.params.id;
    return requestedId === user.userId;
  }
}
