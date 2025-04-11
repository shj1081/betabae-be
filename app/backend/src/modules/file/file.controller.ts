import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileRequestDto } from 'src/dto/file/upload-file.request.dto';
import { UploadFileResponseDto } from '../../dto/file/upload-file.response.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileRequestDto,
  ): Promise<UploadFileResponseDto> {
    return this.fileService.uploadFile(file, body.context);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteFile(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.fileService.deleteFile(id);
  }
}
