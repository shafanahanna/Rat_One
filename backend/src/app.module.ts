import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BranchModule } from './branch/branch.module';
import { CountryModule } from './country/country.module';
import { UserModule } from './user/user.module';
import { EmployeeModule } from './employee/employee.module';
import { PayrollModule } from './payroll/payroll.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveManagementModule } from './leave-management/leave-management.module';
import { RolesModule as AuthRolesModule } from './auth/roles/roles.module';
import { RolesModule } from './roles.module';
import { DepartmentsModule } from './departments/departments.module';
import { DesignationsModule } from './designations/designations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const sslValue = configService.get('PG_SSL');
        const sslEnabled = sslValue === 'true' || sslValue === true;
        console.log('SSL Enabled:', sslEnabled); // Debug log
        
        return {
          type: 'postgres',
          host: configService.get('PG_HOST'),
          port: configService.get<number>('PG_PORT'),
          username: configService.get('PG_USER'),
          password: configService.get('PG_PASSWORD'),
          database: configService.get('PG_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          ssl: sslEnabled ? { rejectUnauthorized: false } : false,
          synchronize: false, // Disable auto schema synchronization
        };
      },
    }),
    AuthModule, // Import the AuthModule
    BranchModule, // Import the BranchModule
    CountryModule, // Import the CountryModule
    UserModule, // Import the UserModule
    EmployeeModule, // Import the EmployeeModule
    PayrollModule, // Import the PayrollModule
    AttendanceModule, // Import the AttendanceModule
    LeaveManagementModule, // Import the LeaveManagementModule
    RolesModule, // Import the RolesModule
    DepartmentsModule, // Import the DepartmentsModule
    DesignationsModule, // Import the DesignationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
