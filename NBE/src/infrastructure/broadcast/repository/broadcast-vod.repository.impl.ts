// src/infrastructure/broadcast-video/repository/broadcast-video.repository.impl.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BroadcastVideoRepository } from '../../../domain/broadcast/interface/broadcast-video.repository';
import { BroadcastVideoDomain } from '../../../domain/broadcast/model/broadcast-video.domain';
import { BroadcastVideoMapper } from '../mapper/broadcast-video.mapper';
import { BroadcastVideoEntity } from '../entity/broadcast-video.entity';

@Injectable()
export class BroadcastVideoRepositoryImpl implements BroadcastVideoRepository {
  constructor(
    @InjectRepository(BroadcastVideoEntity)
    private readonly broadcastVideoRepository: Repository<BroadcastVideoEntity>,
  ) {}

  // VOD 생성
  async create(broadcastVideoDomain: BroadcastVideoDomain): Promise<BroadcastVideoDomain> {
    const entity = BroadcastVideoMapper.toEntity(broadcastVideoDomain);
    const savedEntity = await this.broadcastVideoRepository.save(entity);
    return BroadcastVideoMapper.toDomain(savedEntity);
  }

  // 특정 방송의 VOD 목록 조회
  async findByBroadcastId(broadcastId: number): Promise<BroadcastVideoDomain[]> {
    const entities = await this.broadcastVideoRepository.find({ where: { broadcastId } });
    return entities.map(BroadcastVideoMapper.toDomain);
  }
}
