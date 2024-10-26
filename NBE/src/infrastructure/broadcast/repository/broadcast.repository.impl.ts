import { LessThanOrEqual, Repository } from 'typeorm';
import { BroadcastEntity, StatusEnum } from '../entity/broadcast.entity';
import { BroadcastMapper } from '../mapper/broadcast.mapper';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BroadcastDomain } from '../../../domain/broadcast/model/broadcast.domain';
import { BroadcastRepository } from '../../../domain/broadcast/interface/broadcast.repository';
import { CustomException } from '../../../common/exception/custom.exception';
import { ErrorCode } from '../../../common/enum/error-code.enum';
import { Nullable } from '../../../common/type/native';
import dayjs from 'dayjs';

@Injectable()
export class BroadcastRepositoryImpl implements BroadcastRepository {
  constructor(
    @InjectRepository(BroadcastEntity)
    private readonly broadcastRepository: Repository<BroadcastEntity>,
  ) {}

  // 방송 생성
  async createBroadcast(broadcastDomain: BroadcastDomain): Promise<BroadcastDomain> {
    const entity = BroadcastMapper.toEntity(broadcastDomain);
    const savedEntity = await this.broadcastRepository.save(entity);
    return BroadcastMapper.toDomain(savedEntity);
  }

  // 특정 방송 조회
  async getBroadcastById(broadcastId: number): Promise<Nullable<BroadcastDomain>> {
    const entity = await this.broadcastRepository.findOne({ where: { id: broadcastId } });
    return entity ? BroadcastMapper.toDomain(entity) : null;
  }

  // 방송 업데이트
  async updateBroadcast(broadcastDomain: BroadcastDomain): Promise<BroadcastDomain> {
    const entity = BroadcastMapper.toEntity(broadcastDomain);
    const updatedEntity = await this.broadcastRepository.save(entity);
    return BroadcastMapper.toDomain(updatedEntity);
  }

  // 방송 삭제
  async deleteBroadcast(broadcastId: number): Promise<void> {
    const result = await this.broadcastRepository.delete(broadcastId);
    if (result.affected === 0) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }
  }

  // 방송 시작
  async startBroadcast(broadcastDomain: BroadcastDomain): Promise<BroadcastDomain> {
    const entity = BroadcastMapper.toEntity(broadcastDomain);
    entity.status = StatusEnum.LIVE;
    const savedEntity = await this.broadcastRepository.save(entity);
    return BroadcastMapper.toDomain(savedEntity);
  }

  // 예약 방송 시작
  async scheduleBroadcast(broadcastDomain: BroadcastDomain): Promise<BroadcastDomain> {
    const entity = BroadcastMapper.toEntity(broadcastDomain);
    entity.status = StatusEnum.SCHEDULED;
    const savedEntity = await this.broadcastRepository.save(entity);
    return BroadcastMapper.toDomain(savedEntity);
  }

  // 방송 종료
  async endBroadcast(broadcastId: number): Promise<void> {
    const broadcast = await this.broadcastRepository.findOne({ where: { id: broadcastId } });
    if (!broadcast) throw new CustomException(ErrorCode.NOT_FOUND);
    broadcast.status = StatusEnum.OFF_AIR;
    broadcast.viewerCount = 0;
    await this.broadcastRepository.save(broadcast);
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

  // 예약된 방송 목록 조회
  async getScheduledBroadcasts(): Promise<BroadcastDomain[]> {
    const now = dayjs().toDate(); // 현재 시간을 Date 객체로 변환
    const entities = await this.broadcastRepository.find({
      where: {
        status: StatusEnum.SCHEDULED,
        scheduledTime: LessThanOrEqual(now),
      },
    });
    return entities.map(BroadcastMapper.toDomain);
  }

  // 실시간 방송 목록 조회
  async getLiveBroadcasts(): Promise<BroadcastDomain[]> {
    const entities = await this.broadcastRepository.find({
      where: { status: StatusEnum.LIVE },
    });
    return entities.map(BroadcastMapper.toDomain);
  }
}
