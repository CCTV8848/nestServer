import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { memoryStorage } from 'multer';
// 初始化Cloudinary
@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      storage: memoryStorage(), // 临时存储路径
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB限制
      },
    }),
  ],
  controllers: [UploadController],
  providers: [
    UploadService,
    // 提供Cloudinary配置作为provider
    {
      provide: 'CLOUDINARY',
      useFactory: (configService: ConfigService) => {
        return cloudinary.config({
          cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get<string>('CLOUDINARY_API_KEY'),
          api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
        });
      },
      inject: [ConfigService],
    },
  ],
})export class UploadModule {}
