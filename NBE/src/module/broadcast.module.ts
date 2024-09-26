import { BroadcastEntity } from './../infrastructure/broadcast/entity/broadcast.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BroadcastEntity])],
  controllers: [],
  providers: [],
  exports: [],
})
export class BroadcastModule {}
