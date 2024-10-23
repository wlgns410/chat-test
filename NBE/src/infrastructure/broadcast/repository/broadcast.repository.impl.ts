import { Repository } from 'typeorm';
import { BroadcastEntity } from '../entity/broadcast.entity';
import { BroadcastMapper } from '../mapper/broadcast.mapper';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BroadcastDomain } from '../../../domain/broadcast/model/broadcast.domain';
import { BroadcastRepository } from '../../../domain/broadcast/interface/broadcast.repository';
import { CustomException } from 'src/common/exception/custom.exception';
import { ErrorCode } from 'src/common/enum/error-code.enum';

@Injectable()
export class BroadcastRepositoryImpl implements BroadcastRepository {
  constructor(
    @InjectRepository(BroadcastEntity)
    private readonly broadcastRepository: Repository<BroadcastEntity>,
  ) {}

  // 방송 시작: title, description, tags, thumbnailUrl 설정 및 status 변경
  async startBroadcast(broadcastDomain: BroadcastDomain): Promise<BroadcastDomain> {
    const entity = BroadcastMapper.toEntity(broadcastDomain);
    entity.status = 'live'; // off_air -> live
    const savedEntity = await this.broadcastRepository.save(entity);
    return BroadcastMapper.toDomain(savedEntity);
  }

  // 예약 방송 시작
  async scheduleBroadcast(broadcastDomain: BroadcastDomain): Promise<BroadcastDomain> {
    const entity = BroadcastMapper.toEntity(broadcastDomain);
    entity.status = 'scheduled'; // off_air -> scheduled
    const savedEntity = await this.broadcastRepository.save(entity);
    return BroadcastMapper.toDomain(savedEntity);
  }

  // 방송 종료
  async endBroadcast(broadcastId: number): Promise<void> {
    const broadcast = await this.broadcastRepository.findOne({ where: { id: broadcastId } });
    if (!broadcast) throw new CustomException(ErrorCode.NOT_FOUND);
    broadcast.status = 'off_air';
    broadcast.viewerCount = 0; // 방송 종료 후 뷰어 수 리셋
    const updatedEntity = await this.broadcastRepository.save(broadcast);
    await this.broadcastRepository.save(updatedEntity);
  }

  // 뷰어 수 업데이트
  async updateViewerCount(broadcastId: number, viewerCount: number): Promise<BroadcastDomain> {
    const entity = await this.broadcastRepository.findOne({ where: { id: broadcastId } });
    if (!entity) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }
    entity.viewerCount = viewerCount;
    const updatedEntity = await this.broadcastRepository.save(entity);
    return BroadcastMapper.toDomain(updatedEntity);
  }
}
