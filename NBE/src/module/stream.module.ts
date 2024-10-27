import { Module } from '@nestjs/common';
import { SubtitleService } from '../domain/broadcast/service/subtitle.service';
import { SpeechToTextService } from '../domain/broadcast/service/speech-to-text.service';
import { StreamSubtitleService } from '../domain/broadcast/service/stream.service';
import { MinioModule } from './minio.module';

@Module({
  imports: [MinioModule], // MinioModule 추가
  providers: [SubtitleService, SpeechToTextService, StreamSubtitleService],
  exports: [StreamSubtitleService],
})
export class StreamSubtitleModule {}
