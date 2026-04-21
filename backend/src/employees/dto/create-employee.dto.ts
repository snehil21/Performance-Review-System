import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Employee email address',
    example: 'employee@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Employee full name',
    example: 'Jane Smith',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Default password for the employee (optional, minimum 6 characters)',
    example: 'defaultpass123',
    required: false,
    minLength: 6,
  })
  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  default_password?: string;
}
