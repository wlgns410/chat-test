import { BroadcastService } from '../../../../domain/broadcast/service/broadcast.service';
import { BroadcastDomain } from '../../../../domain/broadcast/model/broadcast.domain';
import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, HttpException, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../../../common/guard/auth.guard';

@ApiTags('broadcasts')
@Controller('broadcasts')
export class BroadcastController {
  constructor(private readonly broadcastService: BroadcastService) {}

  // 방송 생성
  @ApiOperation({ summary: '방송 생성' })
  @ApiResponse({ status: 200, description: '방송 생성' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async createBroadcast(@Body() broadcastData: BroadcastDomain): Promise<BroadcastDomain> {
    try {
      return await this.broadcastService.createBroadcast(broadcastData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 특정 방송 조회
  @ApiOperation({ summary: '특정 방송 조회' })
  @ApiResponse({ status: 200, description: '특정 방송 조회' })
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
  @ApiOperation({ summary: '방송 업데이트' })
  @ApiResponse({ status: 200, description: '방송 업데이트' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
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
  @ApiOperation({ summary: '방송 삭제' })
  @ApiResponse({ status: 200, description: '방송 삭제' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteBroadcast(@Param('id') id: number): Promise<void> {
    try {
      await this.broadcastService.deleteBroadcast(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 방송 시작
  @ApiOperation({ summary: '방송 시작' })
  @ApiResponse({ status: 200, description: '방송 시작' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
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
  @ApiOperation({ summary: '방송 종료' })
  @ApiResponse({ status: 200, description: '방송 종료' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id/end')
  async endBroadcast(@Param('id') id: number): Promise<void> {
    try {
      await this.broadcastService.endBroadcast(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
