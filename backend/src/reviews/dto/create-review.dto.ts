import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'UUID of the employee being reviewed',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  assignee_id: string;

  @ApiProperty({
    description: 'UUID of the reviewer',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  reviewer_id: string;

  @ApiProperty({
    description: 'Review topic or performance area',
    example: 'Team collaboration and communication skills',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Review status',
    example: 'todo',
    enum: ['todo', 'in_progress', 'done'],
    required: false,
  })
  @IsEnum(['todo', 'in_progress', 'done'])
  @IsOptional()
  status?: 'todo' | 'in_progress' | 'done';

  @ApiProperty({
    description: 'Due date for the review (ISO 8601 format)',
    example: '2026-05-21',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  due_date?: string;
}
