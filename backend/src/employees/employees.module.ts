import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { User } from '../database/user.entity';
import { HashService } from '../common/services/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [EmployeesController],
  providers: [EmployeesService, HashService],
})
export class EmployeesModule {}
