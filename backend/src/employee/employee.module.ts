import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.entity';
import { CloudinaryProvider, CloudinaryService } from '../config/cloudinary.config';
import { DesignationsModule } from '../designations/designations.module';
import { User } from '../auth/entities/user.entity';
import { SyncDesignationService } from './sync-designation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, User]),
    DesignationsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '24h' },
      }),
    }),
    ConfigModule,
  ],
  controllers: [EmployeeController, ],
  providers: [EmployeeService, CloudinaryProvider, CloudinaryService, SyncDesignationService],
  exports: [EmployeeService, SyncDesignationService],
})
export class EmployeeModule {}
