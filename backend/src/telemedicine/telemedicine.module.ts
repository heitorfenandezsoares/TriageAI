import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeleRoom } from './tele-room.entity.js';
import { TelemedicineController } from './telemedicine.controller.js';
import { TelemedicineService } from './telemedicine.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([TeleRoom])],
  controllers: [TelemedicineController],
  providers: [TelemedicineService],
})
export class TelemedicineModule {}
