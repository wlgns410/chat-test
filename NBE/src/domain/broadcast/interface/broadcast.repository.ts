import { Nullable } from '../../../common/type/native';
import { BroadcastDomain } from '../../../domain/broadcast/model/broadcast.domain';

export const BroadcastRepositorySymbol = Symbol.for('BroadcastRepository');

export interface BroadcastRepository {
  // 방송 생성
  createBroadcast(broadcastDomain: BroadcastDomain): Promise<BroadcastDomain>;

  // 특정 방송 조회
  getBroadcastById(broadcastId: number): Promise<Nullable<BroadcastDomain>>;

  // 방송 업데이트
  updateBroadcast(broadcastDomain: BroadcastDomain): Promise<BroadcastDomain>;

  // 방송 삭제
  deleteBroadcast(broadcastId: number): Promise<void>;

  // 방송 시작
  startBroadcast(broadcastDomain: BroadcastDomain): Promise<BroadcastDomain>;

  // 예약 방송 시작
  scheduleBroadcast(broadcastDomain: BroadcastDomain): Promise<BroadcastDomain>;

  // 방송 종료
  endBroadcast(broadcastId: number): Promise<void>;

  // 뷰어 수 업데이트
  updateViewerCount(broadcastId: number, viewerCount: number): Promise<BroadcastDomain>;

  // 예약된 방송 목록 조회
  getScheduledBroadcasts(): Promise<BroadcastDomain[]>;

  // 방송중인 목록 조회
  getLiveBroadcasts(): Promise<BroadcastDomain[]>;
}
