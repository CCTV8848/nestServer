import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  get jwtSecret(): string {
    return this.nestConfigService.get<string>('JWT_SECRET') ?? '';
  }

  get jwtExpiresIn(): string {
    return this.nestConfigService.get<string>('JWT_EXPIRES_IN')?? '';
  }

  get mongodbUri(): string {
    return this.nestConfigService.get<string>('MONGODB_URI')?? '';
  }

  get mongodbDbName(): string {
    return this.nestConfigService.get<string>('MONGODB_DB_NAME')?? '';
  }

  get port(): number {
    return this.nestConfigService.get<number>('PORT', 3000);
  }
}