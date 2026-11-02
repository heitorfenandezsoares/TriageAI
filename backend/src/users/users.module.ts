import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service.js';
import { User } from './user.entity.js';
import { UserProfessional } from './user-professional.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfessional])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
