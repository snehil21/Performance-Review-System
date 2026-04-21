import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmployeeDto {
  @ApiProperty({
    description: 'Employee full name',
    example: 'Jane Smith',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Employee email address',
    example: 'newemail@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
