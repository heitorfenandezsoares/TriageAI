import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PatientsModule } from './patients/patients.module.js';
import { BedsModule } from './beds/beds.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { TelemedicineModule } from './telemedicine/telemedicine.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10, ),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      // Só liga com DB_SYNCHRONIZE=true (cria/altera tabelas sozinho; nunca em produção)
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      
    }),
    PatientsModule, 
    BedsModule, UsersModule, AuthModule, TelemedicineModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
