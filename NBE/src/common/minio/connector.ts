import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { CustomException } from '../../common/exception/custom.exception';
import { ErrorCode } from '../../common/enum/error-code.enum';

@Injectable()
export class MinioConnector {
  private minioClient: Client;

  constructor() {
    this.minioClient = new Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
    });
  }

  async uploadFile(bucket: string, filePath: string, file: Buffer) {
    const bucketExists = await this.minioClient.bucketExists(bucket);
    if (!bucketExists) {
      throw new CustomException(ErrorCode.NOT_EXISTED_BUCKET);
    }
    return this.minioClient.putObject(bucket, filePath, file);
  }

  async getFile(bucket: string, filePath: string) {
    const bucketExists = await this.minioClient.bucketExists(bucket);
    if (!bucketExists) {
      throw new Error('Bucket does not exist');
    }

    return this.minioClient.getObject(bucket, filePath);
  }

  async deleteFile(bucket: string, filePath: string) {
    const bucketExists = await this.minioClient.bucketExists(bucket);
    if (!bucketExists) {
      throw new CustomException(ErrorCode.NOT_EXISTED_BUCKET);
    }
    return this.minioClient.removeObject(bucket, filePath);
  }
}
