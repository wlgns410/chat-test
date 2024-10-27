import { Injectable, Inject } from '@nestjs/common';
import { BroadcastVideoDomain } from '../model/broadcast-video.domain';
import { BroadcastVideoRepository, BroadcastVideoRepositorySymbol } from '../interface/broadcast-video.repository';

@Injectable()
export class BroadcastVideoService {
  constructor(
    @Inject(BroadcastVideoRepositorySymbol)
    private readonly broadcastVideoRepository: BroadcastVideoRepository, // 인터페이스로 변경
  ) {}

  // VOD 생성
  async createBroadcastVideo(broadcastVideoDomain: BroadcastVideoDomain): Promise<BroadcastVideoDomain> {
    return this.broadcastVideoRepository.create(broadcastVideoDomain);
  }

  // 특정 방송의 VOD 목록 조회
  async getBroadcastVideos(broadcastId: number): Promise<BroadcastVideoDomain[]> {
    return this.broadcastVideoRepository.findByBroadcastId(broadcastId);
  }
}
