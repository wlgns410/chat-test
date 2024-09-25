import { Broadcast } from './../infrastructure/broadcast/entity/broadcast.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Broadcast])],
  controllers: [],
  providers: [],
  exports: [],
})
export class BroadcastModule {}
