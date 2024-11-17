import { Injectable, Inject } from '@nestjs/common';
import { BroadcastRepository, BroadcastRepositorySymbol } from '../interface/broadcast.repository';
import { BroadcastDomain } from '../model/broadcast.domain';
import { Nullable } from '../../../common/type/native';
import { StreamSubtitleService } from './stream.service';
import { ViewerService } from '../../redis/service/redis.service';

@Injectable()
export class BroadcastService {
  constructor(
    @Inject(BroadcastRepositorySymbol)
    private readonly broadcastRepository: BroadcastRepository,
    private readonly streamSubtitleService: StreamSubtitleService,
    private readonly viewerService: ViewerService,
  ) {}

  // 방송 생성
  async createBroadcast(broadcastDomain: BroadcastDomain): Promise<BroadcastDomain> {
    return this.broadcastRepository.createBroadcast(broadcastDomain);
  }

  // 특정 방송 조회
  async getBroadcastById(broadcastId: number): Promise<Nullable<BroadcastDomain>> {
    return this.broadcastRepository.getBroadcastById(broadcastId);
  }

  // 방송 업데이트
  async updateBroadcast(broadcastDomain: BroadcastDomain): Promise<BroadcastDomain> {
    return this.broadcastRepository.updateBroadcast(broadcastDomain);
  }

  // 방송 삭제
  async deleteBroadcast(broadcastId: number): Promise<void> {
    await this.broadcastRepository.deleteBroadcast(broadcastId);
  }

  // 방송 시작
  async startBroadcast(broadcastDomain: BroadcastDomain): Promise<BroadcastDomain> {
    return this.broadcastRepository.startBroadcast(broadcastDomain);
  }

  // 예약 방송 시작
  async scheduleBroadcast(broadcastDomain: BroadcastDomain): Promise<BroadcastDomain> {
    return this.broadcastRepository.scheduleBroadcast(broadcastDomain);
  }

  // 방송 종료
  async endBroadcast(broadcastId: number): Promise<void> {
    await this.broadcastRepository.endBroadcast(broadcastId);
  }

  // 뷰어 수 업데이트
  async updateViewerCount(broadcastId: number, viewerCount: number): Promise<BroadcastDomain> {
    return this.broadcastRepository.updateViewerCount(broadcastId, viewerCount);
  }

  // 예약된 방송 목록 조회
  async getScheduledBroadcasts(): Promise<BroadcastDomain[]> {
    return this.broadcastRepository.getScheduledBroadcasts();
  }

  // 방송중인 목록 조회
  async getLiveBroadcasts(): Promise<BroadcastDomain[]> {
    return this.broadcastRepository.getLiveBroadcasts();
  }

  // VOD 영상 등록 및 자막 생성 메서드
  async registerVOD(broadcastDomain: BroadcastDomain, videoBuffer: Buffer): Promise<BroadcastDomain> {
    // 1. VOD 상태로 방송 데이터 업데이트
    const updatedBroadcast = await this.broadcastRepository.updateBroadcast(broadcastDomain);

    // 2. MinIO에 VOD 영상을 저장하고 URL 반환
    const videoUrl = await this.streamSubtitleService.saveStreamToMinio(videoBuffer);

    // 3. 저장된 영상 URL로부터 오디오 청크 추출 및 자막 생성
    this.streamSubtitleService.createSubtitlesFromStream(videoUrl).subscribe({
      next: subtitle => console.log('Generated subtitle:', subtitle.toString()),
      error: err => console.error('Error generating subtitle:', err),
      complete: () => console.log('Subtitle generation complete.'),
    });

    return updatedBroadcast;
  }
}
