import { Module } from '@nestjs/common';
import { MinioConnector } from '../common/minio/connector';

@Module({
  providers: [MinioConnector], // MinioConnector를 모듈에 등록
  exports: [MinioConnector], // 다른 모듈에서 사용할 수 있도록 exports
})
export class MinioModule {}
