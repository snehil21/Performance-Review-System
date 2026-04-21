import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { User } from '../database/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(filters?: any) {
    const query = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.assignee', 'assignee')
      .leftJoinAndSelect('review.reviewer', 'reviewer');

    if (filters?.status) {
      query.andWhere('review.status = :status', { status: filters.status });
    }

    if (filters?.assignee_id) {
      query.andWhere('review.assignee_id = :assignee_id', {
        assignee_id: filters.assignee_id,
      });
    }

    if (filters?.reviewer_id) {
      query.andWhere('review.reviewer_id = :reviewer_id', {
        reviewer_id: filters.reviewer_id,
      });
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['assignee', 'reviewer'],
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async create(createReviewDto: CreateReviewDto) {
    const assignee = await this.userRepository.findOne({
      where: { id: createReviewDto.assignee_id },
    });
    const reviewer = await this.userRepository.findOne({
      where: { id: createReviewDto.reviewer_id },
    });

    if (!assignee || !reviewer) {
      throw new NotFoundException('Assignee or reviewer not found');
    }

    const review = this.reviewRepository.create(createReviewDto);
    const savedReview = await this.reviewRepository.save(review);

    return this.findOne(savedReview.id);
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.findOne(id);

    if (updateReviewDto.reviewer_id) {
      const reviewer = await this.userRepository.findOne({
        where: { id: updateReviewDto.reviewer_id },
      });
      if (!reviewer) {
        throw new NotFoundException('Reviewer not found');
      }
    }

    Object.assign(review, updateReviewDto);
    await this.reviewRepository.save(review);

    return this.findOne(id);
  }

  async delete(id: string) {
    const review = await this.findOne(id);
    await this.reviewRepository.remove(review);
    return { message: 'Review deleted successfully' };
  }

  async submitFeedback(
    id: string,
    userId: string,
    submitFeedbackDto: SubmitFeedbackDto,
  ) {
    const review = await this.findOne(id);

    if (review.reviewer_id !== userId) {
      throw new ForbiddenException(
        'Only assigned reviewer can submit feedback',
      );
    }

    review.description = submitFeedbackDto.feedback;
    await this.reviewRepository.save(review);

    return this.findOne(id);
  }

  async updateStatus(
    id: string,
    userId: string,
    newStatus: 'todo' | 'in_progress' | 'done',
  ) {
    const review = await this.findOne(id);

    if (review.reviewer_id !== userId) {
      throw new ForbiddenException('Only assigned reviewer can update status');
    }

    review.status = newStatus;
    await this.reviewRepository.save(review);

    return this.findOne(id);
  }
}
