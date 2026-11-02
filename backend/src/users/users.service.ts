import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import { UserProfessional } from './user-professional.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserProfessional)
    private professionalsRepository: Repository<UserProfessional>,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(userDto: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userDto);
    return this.usersRepository.save(user as User);
  }

  async findOneProfessional(email: string): Promise<UserProfessional | null> {
    return this.professionalsRepository.findOne({ where: { email } });
  }

  async createProfessional(profDto: Partial<UserProfessional>): Promise<UserProfessional> {
    const prof = this.professionalsRepository.create(profDto);
    return this.professionalsRepository.save(prof as UserProfessional);
  }
}
