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
      .orderBy('chat.createdAt', 'ASC') // 채팅 생성 시간 기준 오름차순 정렬
      .skip(pagination.getSkip())
      .take(pagination.getTake())
      .getManyAndCount();

    const chatDomains = chatEntities.map(ChatMapper.toDomain); // Entity -> Domain 변환

    // PaginationResponse 빌더를 사용하여 페이지네이션 응답 생성
    return new PaginationBuilder<ChatDomain>()
      .setData(chatDomains) // 데이터 설정
      .setPage(pagination.getPage()) // 현재 페이지 설정
      .setTake(pagination.getTake()) // 한 페이지에 표시할 항목 수 설정
      .setTotalCount(totalCount) // 전체 항목 수 설정
      .build(); // 최종 빌드
  }

  // 한 방송에서 모든 채팅을 조회하는 메서드 (오름차순 정렬)
  async findAllChatsInBroadcast(broadcastId: number, pagination: PaginationRequest): Promise<PaginationResponse<ChatDomain>> {
    const [chatEntities, totalCount] = await this.chatRepository
      .createQueryBuilder('chat')
      .where('chat.broadcastId = :broadcastId', { broadcastId })
      .orderBy('chat.createdAt', 'ASC') // 채팅 생성 시간 기준 오름차순 정렬
      .skip(pagination.getSkip()) // 페이지 스킵 설정
      .take(pagination.getTake()) // 페이지 테이크 설정
      .getManyAndCount(); // 데이터와 전체 개수 가져오기

    const chatDomains = chatEntities.map(ChatMapper.toDomain); // Entity -> Domain 변환

    // PaginationResponse 빌더를 사용하여 페이지네이션 응답 생성
    return new PaginationBuilder<ChatDomain>()
      .setData(chatDomains) // 데이터 설정
      .setPage(pagination.getPage()) // 현재 페이지 설정
      .setTake(pagination.getTake()) // 한 페이지에 표시할 항목 수 설정
      .setTotalCount(totalCount) // 전체 항목 수 설정
      .build(); // 최종 빌드
  }
}
