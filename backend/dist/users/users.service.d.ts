import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import { UserProfessional } from './user-professional.entity.js';
export declare class UsersService {
    private usersRepository;
    private professionalsRepository;
    constructor(usersRepository: Repository<User>, professionalsRepository: Repository<UserProfessional>);
    findOne(email: string): Promise<User | null>;
    create(userDto: Partial<User>): Promise<User>;
    findOneProfessional(email: string): Promise<UserProfessional | null>;
    createProfessional(profDto: Partial<UserProfessional>): Promise<UserProfessional>;
}
