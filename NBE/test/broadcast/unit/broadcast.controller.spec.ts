// src/domain/broadcast/model/broadcast.domain.spec.ts

import { BroadcastDomain } from '../../../src/domain/broadcast/model/broadcast.domain';
import { StatusEnum } from '../../../src/infrastructure/broadcast/entity/broadcast.entity';

describe('BroadcastDomain', () => {
  let broadcast: BroadcastDomain;

  beforeEach(() => {
    broadcast = new BroadcastDomain(
      1,
      1,
      'Test Broadcast',
      'This is a test broadcast',
      StatusEnum.OFF_AIR,
      0,
      null,
      ['tag1', 'tag2'],
      'http://example.com/thumbnail.jpg',
    );
  });

  it('should initialize with correct values', () => {
    expect(broadcast.id).toBe(1);
    expect(broadcast.userId).toBe(1);
    expect(broadcast.title).toBe('Test Broadcast');
    expect(broadcast.description).toBe('This is a test broadcast');
    expect(broadcast.status).toBe(StatusEnum.OFF_AIR);
    expect(broadcast.viewerCount).toBe(0);
    expect(broadcast.scheduledTime).toBeNull();
    expect(broadcast.tags).toEqual(['tag1', 'tag2']);
    expect(broadcast.thumbnailUrl).toBe('http://example.com/thumbnail.jpg');
  });

  // 방송 시작 메서드 테스트
  it('should start the broadcast if status is OFF_AIR', () => {
    broadcast.startBroadcast();
    expect(broadcast.status).toBe(StatusEnum.LIVE);
  });

  it('should not start the broadcast if status is not OFF_AIR', () => {
    broadcast.status = StatusEnum.SCHEDULED;
    broadcast.startBroadcast();
    expect(broadcast.status).toBe(StatusEnum.SCHEDULED);
  });

  // 예약 방송 메서드 테스트
  it('should schedule the broadcast if status is OFF_AIR', () => {
    const scheduledDate = new Date();
    broadcast.scheduleBroadcast(scheduledDate);
    expect(broadcast.status).toBe(StatusEnum.SCHEDULED);
    expect(broadcast.scheduledTime).toEqual(scheduledDate);
  });

  it('should not schedule the broadcast if status is not OFF_AIR', () => {
    broadcast.status = StatusEnum.LIVE;
    const scheduledDate = new Date();
    broadcast.scheduleBroadcast(scheduledDate);
    expect(broadcast.status).toBe(StatusEnum.LIVE);
    expect(broadcast.scheduledTime).toBeNull();
  });

  // 방송 종료 메서드 테스트
  it('should end the broadcast if status is LIVE', () => {
    broadcast.status = StatusEnum.LIVE;
    broadcast.endBroadcast();
    expect(broadcast.status).toBe(StatusEnum.OFF_AIR);
    expect(broadcast.viewerCount).toBe(0);
  });

  it('should not end the broadcast if status is not LIVE', () => {
    broadcast.status = StatusEnum.SCHEDULED;
    broadcast.endBroadcast();
    expect(broadcast.status).toBe(StatusEnum.SCHEDULED);
  });

  // 뷰어 수 업데이트 메서드 테스트
  it('should update viewer count if status is LIVE', () => {
    broadcast.status = StatusEnum.LIVE;
    broadcast.updateViewerCount(100);
    expect(broadcast.viewerCount).toBe(100);
  });

  it('should not update viewer count if status is not LIVE', () => {
    broadcast.status = StatusEnum.OFF_AIR;
    broadcast.updateViewerCount(100);
    expect(broadcast.viewerCount).toBe(0);
  });
});
