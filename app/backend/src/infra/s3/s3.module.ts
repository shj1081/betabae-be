import { Module } from '@nestjs/common';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';

@Module({
  providers: [S3Service],
  controllers: [S3Controller], // TODO: delete before production
})
export class S3Module {}
