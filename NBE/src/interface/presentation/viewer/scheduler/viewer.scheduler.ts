import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ViewerService } from '../../../../domain/redis/service/redis.service';
import { BroadcastService } from '../../../../domain/broadcast/service/broadcast.service';

@Injectable()
export class ViewerScheduler {
  constructor(
    private readonly viewerService: ViewerService,
    private readonly broadcastService: BroadcastService,
  ) {}

  // 매 5초마다 방송 목록을 확인하고 시청자 수를 업데이트
  @Cron('*/5 * * * * *') // 5초 간격
  async updateViewerCounts() {
    // 1. 현재 방송 중인 목록 가져오기
    const liveBroadcasts = await this.broadcastService.getLiveBroadcasts();

    // 2. 방송별 시청자 수 갱신
    for (const broadcast of liveBroadcasts) {
      const broadcastId = broadcast.id; // BroadcastDomain의 id 필드 사용

      // 여기서 조건에 따라 증가 또는 감소
      const viewerCount = await this.viewerService.getViewerCount(broadcastId);

      if (viewerCount > 0) {
        // 예: 시청자가 0명 이상일 때 감소
        await this.viewerService.decrementViewerCount(broadcastId);
      } else {
        // 예: 시청자가 없으면 증가
        await this.viewerService.incrementViewerCount(broadcastId);
      }
    }
  }
}
