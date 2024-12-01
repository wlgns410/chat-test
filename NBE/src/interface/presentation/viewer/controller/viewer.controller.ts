import { Controller, Get, Patch, Param } from '@nestjs/common';
import { ViewerService } from '../../../../domain/redis/service/redis.service';

@Controller('viewer')
export class ViewerController {
  constructor(private readonly viewerService: ViewerService) {}

  // 현재 시청자 수 가져오기
  @Get(':broadcastId')
  async getViewerCount(@Param('broadcastId') broadcastId: number): Promise<{ viewerCount: number }> {
    const viewerCount = await this.viewerService.getViewerCount(broadcastId);
    return { viewerCount };
  }

  // 시청자 수 증가
  @Patch(':broadcastId/increment')
  async incrementViewerCount(@Param('broadcastId') broadcastId: number): Promise<{ message: string }> {
    await this.viewerService.incrementViewerCount(broadcastId);
    return { message: `Viewer count for broadcast ${broadcastId} incremented.` };
  }

  // 시청자 수 감소
  @Patch(':broadcastId/decrement')
  async decrementViewerCount(@Param('broadcastId') broadcastId: number): Promise<{ message: string }> {
    await this.viewerService.decrementViewerCount(broadcastId);
    return { message: `Viewer count for broadcast ${broadcastId} decremented.` };
  }
}
