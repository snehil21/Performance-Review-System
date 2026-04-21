import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/user.entity';
import { HashService } from '../common/services/hash.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async findAll() {
    return this.userRepository.find({
      where: { role: 'user' },
      select: ['id', 'name', 'email', 'role', 'created_at'],
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id, role: 'user' },
    });
    if (!user) {
      throw new NotFoundException('Employee not found');
    }
    return user;
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { email, name, default_password } = createEmployeeDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const password = default_password || 'Default@123';
    const hashedPassword = await this.hashService.hashPassword(password);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: 'user',
    });

    const savedUser = await this.userRepository.save(user);
    const { password: _, ...userWithoutPassword } = savedUser;
    return { ...userWithoutPassword, message: 'Employee created successfully' };
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const user = await this.findOne(id);

    if (updateEmployeeDto.email && updateEmployeeDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateEmployeeDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    Object.assign(user, updateEmployeeDto);
    const updatedUser = await this.userRepository.save(user);
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async delete(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: 'Employee deleted successfully' };
  }

  async resetPassword(id: string, newPassword?: string) {
    const user = await this.findOne(id);
    const password = newPassword || 'Default@123';
    const hashedPassword = await this.hashService.hashPassword(password);
    user.password = hashedPassword;
    await this.userRepository.save(user);
    return { message: 'Password reset successfully' };
  }
}
