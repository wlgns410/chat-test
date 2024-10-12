import { Injectable, Inject } from '@nestjs/common';
import { ChatRepositorySymbol, ChatRepositoy } from '../interface/chat.repository';
import { ChatDomain } from '../../../domain/chat/model/chat.domain';
import { PaginationRequest } from '../../../common/pagination/pagination-request';
import { PaginationResponse } from '../../../common/pagination/pagination-builder';
import { Nullable } from '../../../common/type/native';

@Injectable()
export class ChatService {
  constructor(
    @Inject(ChatRepositorySymbol)
    private readonly chatRepository: ChatRepositoy,
  ) {}

  // 새로운 채팅 생성
  async createChat(chatDomain: ChatDomain): Promise<Nullable<ChatDomain>> {
    console.log('here service');
    return await this.chatRepository.createChat(chatDomain);
  }

  // 특정 유저의 채팅 조회
  async getUserChatsInBroadcast(userId: number, broadcastId: number, pagination: PaginationRequest): Promise<PaginationResponse<ChatDomain>> {
    return await this.chatRepository.getUserChatsInBroadcast(userId, broadcastId, pagination);
  }

  // 특정 방송의 모든 채팅 조회
  async getAllChatsInBroadcast(broadcastId: number, pagination: PaginationRequest): Promise<PaginationResponse<ChatDomain>> {
    return await this.chatRepository.getAllChatsInBroadcast(broadcastId, pagination);
  }
}
