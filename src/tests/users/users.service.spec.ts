import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { usersProviders } from '../../users/schemas/users.providers';

describe('UsersService', () => {
  let service: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, ...usersProviders],
    })
      .overrideProvider('USER_MODEL')
      .useValue((): void => undefined)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash be valid', () => {
    const password = '123123';
    const hash = '$2b$10$dn0q4USLCWc375slQUiwwOEG0TRsKRi5K8LdIFt0UEdlcZAs.rKci';

    expect(service.verifyPassword(password, hash)).toBeTruthy();
  });
});
