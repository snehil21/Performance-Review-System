import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiProperty({
    description: 'Review feedback or description',
    example: 'Great performance in Q1. Good team collaboration.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Review status',
    example: 'in_progress',
    enum: ['todo', 'in_progress', 'done'],
    required: false,
  })
  @IsEnum(['todo', 'in_progress', 'done'])
  @IsOptional()
  status?: 'todo' | 'in_progress' | 'done';

  @ApiProperty({
    description: 'UUID of the new reviewer',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  reviewer_id?: string;

  @ApiProperty({
    description: 'New due date (ISO 8601 format)',
    example: '2026-06-21',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  due_date?: string;
}
