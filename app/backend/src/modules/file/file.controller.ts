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

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * Uploads a file to the server with the specified context.
   * 
   * @param file The file to be uploaded.
   * @param body The request body containing context information.
   * @returns A promise that resolves to the upload file response DTO.
   * @throws BadRequestException if the file or context is not provided.
   */
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileRequestDto,
  ): Promise<UploadFileResponseDto> {
    return this.fileService.uploadFile(file, body.context);
  }

  /**
   * Deletes a file by its ID.
   * 
   * @param id The ID of the file to be deleted.
   * @throws BadRequestException if the file is not found.
   */
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteFile(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.fileService.deleteFile(id);
  }
}
