import { Injectable } from '@nestjs/common';
import { MinioRepositoryImpl } from '../../../infrastructure/minio/repository/minio.repository.impl';

@Injectable()
export class MinioService {
  constructor(private readonly imageRepository: MinioRepositoryImpl) {}

  async uploadImage(file: Buffer, filename: string) {
    const bucket = 'images';
    return this.imageRepository.saveImage(bucket, filename, file);
  }

  async fetchImage(filename: string) {
    const bucket = 'images';
    return this.imageRepository.getImage(bucket, filename);
  }
}
