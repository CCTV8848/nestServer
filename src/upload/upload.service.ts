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
  //删除上传到Cloudinary的某张图片
  // 删除上传到Cloudinary的某张图片
async deleteImage(publicId: string): Promise<{ success: boolean; message: string }> {
  try {
    // 从URL中提取publicId
    if (publicId.includes('/')) {
      const parts = publicId.split('/');
      const filenameWithExt = parts[parts.length - 1];
      const filename = filenameWithExt.split('.')[0];
      publicId = `demo-articles/${filename}`; // 文件夹/文件名，不带扩展名
    }

    // 调用Cloudinary API删除图片
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, {
        resource_type: 'image'
      }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });

    if (result.result === 'ok') {
      return { success: true, message: '图片删除成功' };
    } else {
      return { success: false, message: `删除失败: ${result.result}` };
    }
  } catch (error) {
    throw new BadRequestException(`删除图片失败: ${error.message}`);
  }
}
}
