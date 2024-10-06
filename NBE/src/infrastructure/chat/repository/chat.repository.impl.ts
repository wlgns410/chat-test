import { Repository } from 'typeorm';
import { ChatEntity } from '../entity/chat.entity';
import { ChatMapper } from '../mapper/chat.mapper';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatDomain } from '../../../domain/chat/model/chat.domain';
import { PaginationResponse, PaginationBuilder } from '../../../common/pagination/pagination-builder';
import { PaginationRequest } from '../../../common/pagination/pagination-request';

@Injectable()
export class ChatRepository implements ChatRepository {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
  ) {}

  // chat을 create하는 메서드
  async createChat(chatDomain: ChatDomain): Promise<ChatEntity> {
    const chatEntity = ChatMapper.toChatEntity(chatDomain);
    return await this.chatRepository.save(chatEntity);
  }

  // 한 방송에서 특정 유저의 모든 채팅을 조회하는 메서드 (오름차순 정렬)
  async findChatsByUserInBroadcast(userId: number, broadcastId: number, pagination: PaginationRequest): Promise<PaginationResponse<ChatDomain>> {
    const [chatEntities, totalCount] = await this.chatRepository
      .createQueryBuilder('chat')
      .where('chat.userId = :userId', { userId })
      .andWhere('chat.broadcastId = :broadcastId', { broadcastId })
      .orderBy('chat.createdAt', 'ASC')
      .skip(pagination.getSkip())
      .take(pagination.getTake())
      .getManyAndCount();

    const chatDomains = chatEntities.map(ChatMapper.toDomain); // Entity -> Domain 변환

    return new PaginationBuilder<ChatDomain>()
      .setData(chatDomains)
      .setPage(pagination.getPage())
      .setTake(pagination.getTake())
      .setTotalCount(totalCount)
      .build();
  }

  // 한 방송에서 모든 채팅을 조회하는 메서드 (오름차순 정렬)
  async findAllChatsInBroadcast(broadcastId: number, pagination: PaginationRequest): Promise<PaginationResponse<ChatDomain>> {
    const [chatEntities, totalCount] = await this.chatRepository
      .createQueryBuilder('chat')
      .where('chat.broadcastId = :broadcastId', { broadcastId })
      .orderBy('chat.createdAt', 'ASC')
      .skip(pagination.getSkip())
      .take(pagination.getTake())
      .getManyAndCount();

    const chatDomains = chatEntities.map(ChatMapper.toDomain); // Entity -> Domain 변환

    return new PaginationBuilder<ChatDomain>()
      .setData(chatDomains)
      .setPage(pagination.getPage())
      .setTake(pagination.getTake())
      .setTotalCount(totalCount)
      .build();
  }
}
