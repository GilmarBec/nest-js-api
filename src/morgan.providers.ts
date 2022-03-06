import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganInterceptor } from 'nest-morgan';

export const morganProviders = [
  {
    provide: APP_INTERCEPTOR,
    useClass: MorganInterceptor('combined'),
  },
];
