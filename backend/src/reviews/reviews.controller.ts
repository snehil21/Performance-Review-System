import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Reviews')
@ApiBearerAuth('access-token')
@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews with optional filters' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'assignee', required: false, description: 'Filter by assignee ID' })
  @ApiQuery({ name: 'reviewer', required: false, description: 'Filter by reviewer ID' })
  @ApiResponse({ status: 200, description: 'List of reviews' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: any) {
    return this.reviewsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ status: 200, description: 'Review found' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new performance review (Admin only)' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req,
  ) {
    if (req.user.role === 'user') {
      const review = await this.reviewsService.findOne(id);
      if (review.reviewer_id !== req.user.userId) {
        throw new Error('Unauthorized to update this review');
      }

      const allowedUpdates = {};
      if (updateReviewDto.description !== undefined) {
        allowedUpdates['description'] = updateReviewDto.description;
      }
      if (updateReviewDto.status !== undefined) {
        allowedUpdates['status'] = updateReviewDto.status;
      }

      return this.reviewsService.update(id, allowedUpdates);
    }

    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a review (Admin only)' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async delete(@Param('id') id: string) {
    return this.reviewsService.delete(id);
  }

  @Post(':id/feedback')
  @ApiOperation({ summary: 'Submit feedback for a review' })
  @ApiResponse({ status: 200, description: 'Feedback submitted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async submitFeedback(
    @Param('id') id: string,
    @Body() submitFeedbackDto: SubmitFeedbackDto,
    @Req() req,
  ) {
    return this.reviewsService.submitFeedback(
      id,
      req.user.userId,
      submitFeedbackDto,
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update review status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'todo' | 'in_progress' | 'done' },
    @Req() req,
  ) {
    return this.reviewsService.updateStatus(id, req.user.userId, body.status);
  }
}
