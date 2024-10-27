import { BroadcastVideoDomain } from '../model/broadcast-video.domain';

export const BroadcastVideoRepositorySymbol = Symbol.for('BroadcastVideoRepository');

export interface BroadcastVideoRepository {
  create(broadcastVideoDomain: BroadcastVideoDomain): Promise<BroadcastVideoDomain>;
  findByBroadcastId(broadcastId: number): Promise<BroadcastVideoDomain[]>;
}
