import { Injectable } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import axios from 'axios';
import * as fs from 'fs';
import * as FormData from 'form-data';
import { config } from 'dotenv';
import { CustomException } from '../../../common/exception/custom.exception';
import { ErrorCode } from '../../../common/enum/error-code.enum';

config();

@Injectable()
export class SpeechToTextService {
  private readonly INVOKE_URL = process.env.INVOKE_URL;
  private readonly API_SECRET = process.env.API_SECRET; // Clova Speech Secret Key

  // Naver Clova Speech API로 오디오 전송하여 자막 생성
  sendAudioToNaverAPI(audioChunkPath: string): Observable<string> {
    const apiUrl = `${this.INVOKE_URL}/recognizer/upload`;
    const formData = new FormData();
    formData.append('media', fs.createReadStream(audioChunkPath)); // 오디오 청크 파일
    formData.append(
      'params',
      JSON.stringify({
        language: 'ko-KR',
        completion: 'sync',
        wordAlignment: true,
        fullText: true,
      }),
    );

    const headers = {
      ...formData.getHeaders(),
      'X-CLOVASPEECH-API-KEY': this.API_SECRET,
    };

    return from(
      axios
        .post(apiUrl, formData, { headers })
        .then(response => response.data.text) // 자막 텍스트 추출
        .catch(error => {
          console.error('Error from Naver API:', error);
          throw new CustomException(ErrorCode.NOT_PROCESSING_STREAM_DATA);
        }),
    );
  }
}
