import { BedsService } from './beds.service.js';
export declare class BedsController {
    private readonly bedsService;
    constructor(bedsService: BedsService);
    create(createBedDto: any): Promise<import("./bed.entity.js").Bed>;
    findAll(): Promise<import("./bed.entity.js").Bed[]>;
    findOne(id: string): Promise<import("./bed.entity.js").Bed | null>;
    update(id: string, updateBedDto: any): Promise<import("./bed.entity.js").Bed | null>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
