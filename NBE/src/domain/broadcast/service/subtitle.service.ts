import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import axios from 'axios';
import * as ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class SubtitleService {
  // 외부 URL에서 영상 스트림을 가져와 오디오 청크를 추출하는 메서드
  extractAudioStream(videoUrl: string): Observable<Buffer> {
    return new Observable(observer => {
      // 외부 영상 URL을 axios로 스트리밍
      axios({
        method: 'get',
        url: videoUrl,
        responseType: 'stream',
      })
        .then(response => {
          const videoStream = response.data;

          // FFmpeg로 오디오만 추출
          ffmpeg(videoStream)
            .noVideo()
            .audioCodec('pcm_s16le')
            .format('s16le')
            .pipe()
            .on('data', chunk => observer.next(chunk)) // 오디오 청크 전송
            .on('end', () => observer.complete()) // 스트림 완료 시
            .on('error', error => observer.error(error)); // 에러 발생 시
        })
        .catch(error => observer.error(error)); // axios 스트리밍 에러
    });
  }
}
