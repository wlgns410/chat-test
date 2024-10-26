import { BroadcastEntity } from '../entity/broadcast.entity';
import { BroadcastDomain } from '../../../domain/broadcast/model/broadcast.domain';
import dayjs from 'dayjs';

export class BroadcastMapper {
  // 엔티티 -> 도메인 변환
  static toDomain(entity: BroadcastEntity): BroadcastDomain {
    return new BroadcastDomain(
      entity.id,
      entity.userId,
      entity.title,
      entity.description,
      entity.status,
      entity.viewerCount,
      entity.scheduledTime,
      entity.tags,
      entity.thumbnailUrl,
    );
  }

  // 도메인 -> 엔티티 변환
  static toEntity(domain: BroadcastDomain): BroadcastEntity {
    const entity = new BroadcastEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.title = domain.title;
    entity.description = domain.description;
    entity.status = domain.status;
    entity.viewerCount = domain.viewerCount;
    entity.scheduledTime = dayjs(domain.scheduledTime).toDate();
    entity.tags = domain.tags;
    entity.thumbnailUrl = domain.thumbnailUrl;
    return entity;
  }
}
