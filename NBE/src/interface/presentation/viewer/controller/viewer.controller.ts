import { Controller, Get, Param } from '@nestjs/common';
import { ViewerService } from '../../../../domain/redis/service/redis.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('viewers')
@Controller('viewers')
export class ViewerController {
  constructor(private readonly viewerService: ViewerService) {}

  // 방송 생성
  @ApiOperation({ summary: '시청자 수 조회' })
  @ApiResponse({ status: 200, description: '시청자 수 조회' })
  // 현재 시청자 수 조회
  @Get(':broadcastId')
  async getViewerCount(@Param('broadcastId') broadcastId: number): Promise<{ viewerCount: number }> {
    const viewerCount = await this.viewerService.getViewerCount(broadcastId);
    return { viewerCount };
  }
}
