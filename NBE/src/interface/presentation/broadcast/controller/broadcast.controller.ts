import { BroadcastService } from '../../../../domain/broadcast/service/broadcast.service';
import { BroadcastDomain } from '../../../../domain/broadcast/model/broadcast.domain';
import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, HttpException, Patch } from '@nestjs/common';

@Controller('broadcast')
export class BroadcastController {
  constructor(private readonly broadcastService: BroadcastService) {}

  // 방송 생성
  @Post()
  async createBroadcast(@Body() broadcastData: BroadcastDomain): Promise<BroadcastDomain> {
    try {
      return await this.broadcastService.createBroadcast(broadcastData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 특정 방송 조회
  @Get(':id')
  async getBroadcastById(@Param('id') id: number): Promise<BroadcastDomain | null> {
    try {
      const broadcast = await this.broadcastService.getBroadcastById(id);
      if (!broadcast) {
        throw new HttpException('Broadcast not found', HttpStatus.NOT_FOUND);
      }
      return broadcast;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 방송 업데이트
  @Put(':id')
  async updateBroadcast(@Param('id') id: number, @Body() broadcastData: BroadcastDomain): Promise<BroadcastDomain> {
    try {
      broadcastData.id = id; // 업데이트 시 id를 설정
      return await this.broadcastService.updateBroadcast(broadcastData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 방송 삭제
  @Delete(':id')
  async deleteBroadcast(@Param('id') id: number): Promise<void> {
    try {
      await this.broadcastService.deleteBroadcast(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 방송 시작
  @Patch(':id/start')
  async startBroadcast(@Param('id') id: number, @Body() broadcastData: BroadcastDomain): Promise<BroadcastDomain> {
    try {
      broadcastData.id = id;
      return await this.broadcastService.startBroadcast(broadcastData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 방송 종료
  @Patch(':id/end')
  async endBroadcast(@Param('id') id: number): Promise<void> {
    try {
      await this.broadcastService.endBroadcast(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
