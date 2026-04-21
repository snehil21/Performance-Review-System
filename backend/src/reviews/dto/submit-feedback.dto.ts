import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitFeedbackDto {
  @ApiProperty({
    description: 'Feedback text for the review',
    example: 'John demonstrated excellent problem-solving skills and collaborated well with the team.',
  })
  @IsString()
  feedback: string;
}
