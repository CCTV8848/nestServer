import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(
    private configService: ConfigService,
    @Inject('CLOUDINARY') private cloudinary: any
  ) { }

  // 上传图片到Cloudinary并返回URL
  async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
    try {
      // 检查文件是否为图片
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('只支持图片文件上传');
      }

      // 将图片上传到Cloudinary
      const uploadResult = await new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'demo-articles', // 设置存储文件夹
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('上传结果为空'));
            resolve(result);
          },
        ).end(file.buffer);
      });

      if ('error' in uploadResult) {
        throw new BadRequestException(`文件上传失败: ${uploadResult.error.message}`);
      }

      // 返回Cloudinary生成的图片URL
      return { url: uploadResult.secure_url };
    } catch (error) {
      throw new BadRequestException(`文件上传失败: ${error.message}`);
    }
  }
}
