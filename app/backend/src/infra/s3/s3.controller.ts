import { Controller, Delete, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BasicResponseDto } from 'src/dto/common/basic.response.dto';
import { ErrorResponseDto } from 'src/dto/common/error.response.dto';
import { ExceptionCode } from 'src/enums/custom.exception.code';
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
      return new ErrorResponseDto(
        ExceptionCode.S3_INTERNAL_ERROR,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  @Delete()
  async deleteFile(@Query('url') url: string) {
    try {
      await this.s3Service.deleteFile(url);
      return new BasicResponseDto('success', 'File deleted successfully');
    } catch (error) {
      return new ErrorResponseDto(
        ExceptionCode.S3_INTERNAL_ERROR,
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
