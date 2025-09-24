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
  ) {}

  // 上传图片到Cloudinary并返回URL
  async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
    try {
      // 检查文件是否为图片
      if (!file.mimetype.startsWith('image/')) {
        // 如果有临时文件，删除它
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
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
            // 无论成功失败，都删除临时文件
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
            
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
      // 确保临时文件被删除
      if (file && file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new BadRequestException(`文件上传失败: ${error.message}`);
    }
  }
}
