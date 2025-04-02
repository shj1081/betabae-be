import {
  Controller,
  Delete,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BasicResponseDto } from 'src/dto/common/basic.response.dto';
import { S3Service } from './s3.service';

// TODO: test controller for s3 (should be deleted before production)
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.s3Service.uploadFile(file, 'test'); // save on test directory
      return new BasicResponseDto('success', result);
    } catch (error) {
      return new BasicResponseDto('error', error.message);
    }
  }

  @Delete()
  async deleteFile(@Query('url') url: string) {
    await this.s3Service.deleteFile(url);
    return new BasicResponseDto('success', 'File deleted successfully');
  }
}
