// src/domain/broadcast/service/broadcast.service.ts

import { Injectable, Inject } from '@nestjs/common';
import { BroadcastRepository, BroadcastRepositorySymbol } from '../interface/broadcast.repository';
import { BroadcastDomain } from '../model/broadcast.domain';
import { Nullable } from '../../../common/type/native';

@Injectable()
export class BroadcastService {
  constructor(
    @Inject(BroadcastRepositorySymbol)
    private readonly broadcastRepository: BroadcastRepository,
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
}
