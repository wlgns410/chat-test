import { ChatEntity } from '../entity/chat.entity';
import { ChatDomain } from '../../../domain/chat/model/chat.domain';

export class ChatMapper {
  // 도메인을 엔티티로 변환
  static toChatEntity(domain: ChatDomain): ChatEntity {
    const entity = new ChatEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.broadcastId = domain.broadcastId;
    entity.message = domain.message;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;

    return entity;
  }

  // 엔티티를 도메인으로 변환
  static toDomain(entity: ChatEntity): ChatDomain {
    return new ChatDomain(entity.id, entity.userId, entity.broadcastId, entity.message, entity.createdAt, entity.updatedAt);
  }
}
