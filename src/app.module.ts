import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MorganModule } from 'nest-morgan';
import { morganProviders } from './morgan.providers';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, ConfigModule.forRoot(), MorganModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, ...morganProviders],
})
export class AppModule {}
