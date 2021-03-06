import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (user && this.userService.verifyPassword(password, user.password)) {
      return this.userService.cleanSensibleData(user);
    }

    return undefined;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user._id, role: user.role };

    return { access_token: this.jwtService.sign(payload) };
  }
}
