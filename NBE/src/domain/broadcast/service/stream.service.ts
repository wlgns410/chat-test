import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MinioConnector } from '../../../common/minio/connector'; // MinIO 저장소 연결
import { SubtitleService } from './subtitle.service'; // 자막 서비스 연결

@Injectable()
export class StreamSubtitleService {
  constructor(
    private readonly minioConnector: MinioConnector,
    private readonly subtitleService: SubtitleService,
  ) {}

  // MinIO에 스트림 데이터를 저장하고 파일 URL 반환
  async saveStreamToMinio(buffer: Buffer): Promise<string> {
    const filePath = `stream-data-${Date.now()}.mp4`;

    await this.minioConnector.uploadFile('broadcast', filePath, buffer);
    console.log('Stream data saved successfully.');

    // MinIO에서 파일을 가져올 수 있는 URL 생성
    return `http://localhost:9000/broadcast/${filePath}`; // 실제 MinIO 설정에 맞게 수정 필요
  }

  // 영상 URL로부터 자막을 생성하는 파이프라인
  createSubtitlesFromStream(videoUrl: string): Observable<Buffer> {
    // SubtitleService의 extractAudioStream을 사용해 자막 생성 파이프라인 생성
    return this.subtitleService.extractAudioStream(videoUrl);
  }
}
