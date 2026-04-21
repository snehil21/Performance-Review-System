import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HashService {
  async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');
    return `${salt}:${hash}`;
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const [salt, originalHash] = hashedPassword.split(':');
    const hash = crypto
      .pbkdf2Sync(plainPassword, salt, 100000, 64, 'sha512')
      .toString('hex');
    return hash === originalHash;
  }
}
