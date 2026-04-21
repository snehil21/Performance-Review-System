import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../database/user.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  assignee_id: string;

  @Column({ type: 'uuid' })
  reviewer_id: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ['todo', 'in_progress', 'done'], default: 'todo' })
  status: 'todo' | 'in_progress' | 'done';

  @Column({ type: 'date', nullable: true })
  due_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.reviews_as_assignee)
  @JoinColumn({ name: 'assignee_id' })
  assignee: User;

  @ManyToOne(() => User, (user) => user.reviews_as_reviewer)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;
}
