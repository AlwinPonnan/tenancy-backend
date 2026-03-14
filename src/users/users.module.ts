import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseService } from 'src/database/database.service';
import { UsersRepository } from './users.repository';

@Module({
  providers: [UsersService, DatabaseService, UsersRepository],
  controllers: [UsersController],
   exports: [UsersService,UsersRepository]
})
export class UsersModule {}
