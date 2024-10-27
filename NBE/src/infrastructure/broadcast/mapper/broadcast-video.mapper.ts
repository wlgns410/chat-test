import { BroadcastVideoEntity } from '../entity/broadcast-video.entity';
import { BroadcastVideoDomain } from '../../../domain/broadcast/model/broadcast-video.domain';

export class BroadcastVideoMapper {
  static toDomain(entity: BroadcastVideoEntity): BroadcastVideoDomain {
    return new BroadcastVideoDomain(entity.id, entity.broadcastId, entity.vodUrl, entity.subtitleUrl);
  }

  static toEntity(domain: BroadcastVideoDomain): BroadcastVideoEntity {
    const entity = new BroadcastVideoEntity();
    entity.id = domain.id;
    entity.broadcastId = domain.broadcastId;
    entity.vodUrl = domain.vodUrl;
    entity.subtitleUrl = domain.subtitleUrl;
    return entity;
  }
}
