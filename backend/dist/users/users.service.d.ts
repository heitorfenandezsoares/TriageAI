import { Repository } from 'typeorm';
import { User } from './user.entity.js';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findOne(email: string): Promise<User | null>;
    create(userDto: Partial<User>): Promise<User>;
}
