import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BroadcastEntity } from '../infrastructure/broadcast/entity/broadcast.entity';
import { BroadcastVideoEntity } from '../infrastructure/broadcast/entity/broadcast-video.entity';
import { BroadcastController } from '../interface/presentation/broadcast/controller/broadcast.controller';
import { BroadcastVideoController } from '../interface/presentation/broadcast/controller/broadcast-video.controller';
import { BroadcastService } from '../domain/broadcast/service/broadcast.service';
import { BroadcastVideoService } from '../domain/broadcast/service/broadcast-video.service'; // BroadcastVideo 서비스 추가
import { BroadcastRepositorySymbol } from '../domain/broadcast/interface/broadcast.repository';
import { BroadcastVideoRepositorySymbol } from '../domain/broadcast/interface/broadcast-video.repository';
import { BroadcastRepositoryImpl } from '../infrastructure/broadcast/repository/broadcast.repository.impl';
import { BroadcastVideoRepositoryImpl } from '../infrastructure/broadcast/repository/broadcast-vod.repository.impl';
import { BroadcastGateway } from '../infrastructure/socket/broadcast/broadcast-socket';
import { BroadcastScheduler } from '../interface/presentation/broadcast/scheduler/broadcast.scheduler';
import { StreamSubtitleModule } from './stream.module';
import { ViewerService } from '../domain/redis/service/redis.service';
import { ViewerModule } from './viewer.module';
import { RedisViewerRepository } from '../infrastructure/redis/redis.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([BroadcastEntity, BroadcastVideoEntity]), StreamSubtitleModule, ViewerModule],
  controllers: [BroadcastController, BroadcastVideoController],
  providers: [
    BroadcastGateway,
    BroadcastService,
    BroadcastVideoService,
    BroadcastScheduler,
    ViewerService, // ViewerService 등록
    RedisViewerRepository,
    {
      provide: BroadcastRepositorySymbol,
      useClass: BroadcastRepositoryImpl,
    },
    {
      provide: BroadcastVideoRepositorySymbol,
      useClass: BroadcastVideoRepositoryImpl,
    },
  ],
  exports: [BroadcastService, BroadcastVideoService],
})
export class BroadcastModule {}
