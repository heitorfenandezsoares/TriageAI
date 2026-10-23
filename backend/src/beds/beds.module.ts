import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BedsController } from './beds.controller.js';
import { BedsService } from './beds.service.js';
import { Bed } from './bed.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Bed])],
  controllers: [BedsController],
  providers: [BedsService],
})
export class BedsModule {}
