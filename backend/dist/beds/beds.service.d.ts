import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Bed } from './bed.entity.js';
export declare class BedsService implements OnModuleInit {
    private bedRepo;
    constructor(bedRepo: Repository<Bed>);
    onModuleInit(): Promise<void>;
    create(createBedDto: Partial<Bed>): Promise<Bed>;
    findAll(): Promise<Bed[]>;
    findOne(id: string): Promise<Bed | null>;
    update(id: string, updateBedDto: Partial<Bed>): Promise<Bed | null>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
