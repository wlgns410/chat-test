import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { BroadcastVideoService } from '../../../../domain/broadcast/service/broadcast-video.service';
import { BroadcastVideoDomain } from '../../../../domain/broadcast/model/broadcast-video.domain';

@Controller('broadcast-video')
export class BroadcastVideoController {
  constructor(private readonly broadcastVideoService: BroadcastVideoService) {}

  // VOD 생성
  @Post()
  async createBroadcastVideo(@Body() broadcastVideoData: BroadcastVideoDomain): Promise<BroadcastVideoDomain> {
    return await this.broadcastVideoService.createBroadcastVideo(broadcastVideoData);
  }

  // 특정 방송의 VOD 목록 조회
  @Get(':broadcastId')
  async getBroadcastVideos(@Param('broadcastId') broadcastId: number): Promise<BroadcastVideoDomain[]> {
    return await this.broadcastVideoService.getBroadcastVideos(broadcastId);
  }
}
