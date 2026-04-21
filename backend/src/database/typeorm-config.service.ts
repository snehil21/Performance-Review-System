import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Review } from '../reviews/review.entity';

@Injectable()
export class TypeOrmConfigService {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseUrl = this.configService.get('DATABASE_URL') || process.env.DATABASE_URL;
    const nodeEnv = this.configService.get('NODE_ENV') || process.env.NODE_ENV;

    console.log('Database Config - NODE_ENV:', nodeEnv);
    console.log('Database Config - DATABASE_URL:', databaseUrl ? 'Set' : 'Not set');

    if (databaseUrl) {
      console.log('Using DATABASE_URL connection');
      return {
        type: 'postgres',
        url: databaseUrl,
        entities: [User, Review],
        synchronize: nodeEnv !== 'production',
        logging: nodeEnv !== 'production',
        ssl: nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
      };
    }

    console.log('⚠️ Using fallback DB config (localhost)');
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USER', 'postgres'),
      password: this.configService.get('DB_PASSWORD', 'postgres'),
      database: this.configService.get('DB_NAME', 'performance_review'),
      entities: [User, Review],
      synchronize: nodeEnv !== 'production',
      logging: nodeEnv !== 'production',
    };
  }
}
