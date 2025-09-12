import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from './database.service';
import { User } from './entities/user.entity';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService, DatabaseService, UsersService, JwtStrategy],
  exports: [AuthService, UsersService, JwtModule],
})
export class AuthModule {}
