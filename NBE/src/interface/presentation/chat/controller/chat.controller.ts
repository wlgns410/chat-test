import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ChatService } from '../../../../domain/chat/service/chat.service';
import { ChatDomain } from '../../../../domain/chat/model/chat.domain';
import { PaginationRequest } from '../../../../common/pagination/pagination-request';
import { PaginationResponse } from '../../../../common/pagination/pagination-builder';
import { Nullable } from '../../../../common/type/native';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../../../common/guard/auth.guard';

@ApiTags('chats')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 새로운 채팅 생성
  @ApiOperation({ summary: 'chat 작성' })
  @ApiResponse({ status: 200, description: '새로운 채팅 작성' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async createChat(@Body() chatDomain: ChatDomain): Promise<Nullable<ChatDomain>> {
    console.log('here');
    return await this.chatService.createChat(chatDomain);
  }

  // 특정 유저의 채팅 조회
  @ApiOperation({ summary: '특정 유저 채팅 목록 조회' })
  @ApiResponse({ status: 200, description: '특정 유저 채팅 목록 조회' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('broadcast/:broadcastId/user/:userId')
  async getUserChatsInBroadcast(
    @Param('broadcastId') broadcastId: number,
    @Param('userId') userId: number,
    @Query() pagination: PaginationRequest,
  ): Promise<PaginationResponse<ChatDomain>> {
    return await this.chatService.getUserChatsInBroadcast(userId, broadcastId, pagination);
  }

  // 특정 방송의 모든 채팅 조회
  @ApiOperation({ summary: '모든 유저 채팅 조회' })
  @ApiResponse({ status: 200, description: '모든 유저 채팅 조회' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('broadcast/:broadcastId')
  async getAllChatsInBroadcast(@Param('broadcastId') broadcastId: number, @Query() pagination: PaginationRequest): Promise<PaginationResponse<ChatDomain>> {
    return await this.chatService.getAllChatsInBroadcast(broadcastId, pagination);
  }
}
