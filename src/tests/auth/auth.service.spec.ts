import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EnumRoles, User } from '../../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  const jwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkdpbG1hckJlYyIsInN1YiI6IjYyMjU2N2IzZTEyOTNjMTVmOThhYzJhZiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTY0NjYyMjkyOCwiZXhwIjoxNjQ2NjI2NTI4fQ.reQydgsDzoC-_qaHoBzRMPPYhBmR6OBzSTmexnV2CA0';

  const userService = {
    findOneByUsername() {
      return defaultUser;
    },
    verifyPassword() {
      return true;
    },
    cleanSensibleData(user: any) {
      return user;
    },
  };

  const defaultUser: User = {
    _id: '622567b3e1293c15f98ac2af',
    email: 'gilmarmscontato@gmail.com',
    firstName: 'Gilmar',
    lastName: 'Bec',
    password: '123123',
    username: 'GilmarBec',
    role: EnumRoles.COMMON,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    })
      .overrideProvider(UsersService)
      .useValue(userService)
      .overrideProvider(JwtService)
      .useValue({
        sign() {
          return jwt;
        },
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be valid jwt login', async function () {
    const response = await service.login(defaultUser);

    expect(response).toEqual({ access_token: jwt });
  });

  it('should be valid the user', async function () {
    const response = await service.validateUser('GilmarBec', '123123');

    expect(response).toEqual(defaultUser);
  });
});
