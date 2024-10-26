import { BroadcastEntity } from './../infrastructure/broadcast/entity/broadcast.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BroadcastController } from '../interface/presentation/broadcast/controller/broadcast.controller';
import { BroadcastScheduler } from '../interface/presentation/broadcast/scheduler/broadcast.scheduler';
import { BroadcastService } from '../domain/broadcast/service/broadcast.service';
import { BroadcastRepositorySymbol } from '../domain/broadcast/interface/broadcast.repository';
import { BroadcastRepositoryImpl } from '../infrastructure/broadcast/repository/broadcast.repository.impl';
import { BroadcastGateway } from '../infrastructure/socket/broadcast/broadcast-socket';

@Module({
  imports: [TypeOrmModule.forFeature([BroadcastEntity])],
  controllers: [BroadcastController],
  providers: [
    BroadcastGateway,
    BroadcastService,
    BroadcastScheduler, // 스케줄러를 providers 배열로 이동
    {
      provide: BroadcastRepositorySymbol,
      useClass: BroadcastRepositoryImpl,
    },
  ],
  exports: [BroadcastService],
})
export class BroadcastModule {}
