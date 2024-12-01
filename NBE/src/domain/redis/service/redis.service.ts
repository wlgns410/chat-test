import { Injectable } from '@nestjs/common';
import { RedisViewerRepository } from '../../../infrastructure/redis/redis.repository.impl';

@Injectable()
export class ViewerService {
  constructor(private readonly viewerRepository: RedisViewerRepository) {}

  // 시청자 수 증가
  async incrementViewerCount(broadcastId: number): Promise<void> {
    await this.viewerRepository.incrementViewerCount(broadcastId);
  }

  // 시청자 수 감소
  async decrementViewerCount(broadcastId: number): Promise<void> {
    await this.viewerRepository.decrementViewerCount(broadcastId);
  }

  // 현재 시청자 수 가져오기
  async getViewerCount(broadcastId: number): Promise<number> {
    return this.viewerRepository.getViewerCount(broadcastId);
  }
}
