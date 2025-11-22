import {
  UploadedFile, UseInterceptors,
  UseGuards, Controller, Get,
  Post, Body, Patch,
  Param, Delete
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }



  // 图片上传接口 - 需要登录验证
  @UseGuards(AuthGuard('jwt'))
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadImage(file);
  }
}
