import { Injectable } from '@nestjs/common';
import { MinioConnector } from '../../../common/minio/connector';

@Injectable()
export class MinioRepositoryImpl {
  constructor(private readonly minioConnector: MinioConnector) {}

  async saveImage(bucket: string, filePath: string, file: Buffer) {
    return this.minioConnector.uploadFile(bucket, filePath, file);
  }

  async getImage(bucket: string, filePath: string) {
    return this.minioConnector.getFile(bucket, filePath);
  }
}
