import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BroadcastService } from '../../../../domain/broadcast/service/broadcast.service';
import { BroadcastDomain } from '../../../../domain/broadcast/model/broadcast.domain';
import dayjs from 'dayjs';

@Injectable()
export class BroadcastScheduler {
  constructor(private readonly broadcastService: BroadcastService) {}

  // 예약 방송 시작 - 5 분마다 예약된 방송을 확인하여 시작
  @Cron(CronExpression.EVERY_5_MINUTES)
  async startScheduledBroadcasts() {
    const scheduledBroadcasts = await this.broadcastService.getScheduledBroadcasts();
    for (const broadcast of scheduledBroadcasts) {
      if (this.shouldStartBroadcast(broadcast)) {
        await this.broadcastService.startBroadcast(broadcast);
      }
    }
  }

  // 뷰어 수 업데이트 - 매 10초마다 업데이트
  @Cron(CronExpression.EVERY_10_SECONDS)
  async updateViewerCounts() {
    const liveBroadcasts = await this.broadcastService.getLiveBroadcasts();
    for (const broadcast of liveBroadcasts) {
      const viewerCount = await this.fetchViewerCount(broadcast.id);
      await this.broadcastService.updateViewerCount(broadcast.id, viewerCount);
    }
  }

  private shouldStartBroadcast(broadcast: BroadcastDomain): boolean {
    const now = dayjs();
    return broadcast.scheduledTime ? dayjs(broadcast.scheduledTime).isBefore(now) || dayjs(broadcast.scheduledTime).isSame(now) : false;
  }

  private async fetchViewerCount(broadcastId: number): Promise<number> {
    // 외부 API 또는 다른 서비스에서 뷰어 수를 가져오는 로직 구현
    return Math.floor(Math.random() * 1000); // 예시: 임의의 숫자를 반환
  }
}
