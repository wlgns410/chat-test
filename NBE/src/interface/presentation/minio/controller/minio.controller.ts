import { Controller, Post, Get, Param, UploadedFile, Res } from '@nestjs/common';
import { MinioService } from '../../../../domain/minio/service/minio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('minios')
@Controller('minios')
export class MinioController {
  constructor(private readonly imageService: MinioService) {}

  @ApiOperation({ summary: 'minio 적재 테스트' })
  @ApiResponse({ status: 200, description: '적재 성공' })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.imageService.uploadImage(file.buffer, file.originalname);
  }

  @ApiOperation({ summary: 'minio 조회 테스트' })
  @ApiResponse({ status: 200, description: '조회 성공' })
  @Get(':filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    const fileStream = await this.imageService.fetchImage(filename);
    fileStream.pipe(res); // 파일을 스트리밍하여 응답
  }
}
