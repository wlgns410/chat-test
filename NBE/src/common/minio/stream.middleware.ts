import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MinioConnector } from './connector';
import { ErrorCode } from '../enum/error-code.enum';
import { CustomException } from '../exception/custom.exception';

@Injectable()
export class StreamMiddleware implements NestMiddleware {
  constructor(private readonly minioConnector: MinioConnector) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const chunks: Buffer[] = [];

    // 요청 데이터가 청크로 전송되면 해당 청크를 배열에 저장
    req.on('data', chunk => {
      chunks.push(chunk);
    });

    // 데이터 전송이 끝나면 청크를 병합하여 처리
    req.on('end', async () => {
      const buffer = Buffer.concat(chunks);

      try {
        // MinIO에 저장할 파일 경로
        const filePath = `stream-data-${Date.now()}.mp4`;

        // 데이터를 MinIO에 저장
        await this.minioConnector.uploadFile('broadcast', filePath, buffer);

        console.log('Stream data saved successfully.');

        // 이후의 처리를 위해 다음 미들웨어로 전달
        next();
      } catch (err) {
        console.error('Error saving stream data:', err);
        throw new CustomException(ErrorCode.NOT_PROCESSING_STREAM_DATA);
      }
    });

    // 에러 핸들링
    req.on('error', err => {
      console.error('Stream error:', err);
      throw new CustomException(ErrorCode.UNHANDLED_STREAM);
    });
  }
}
