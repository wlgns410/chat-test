import { StatusEnum } from '../../../infrastructure/broadcast/entity/broadcast.entity';

export class BroadcastDomain {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: StatusEnum;
  viewerCount: number;
  scheduledTime: Date | null;
  tags: string[];
  thumbnailUrl: string;

  constructor(
    id: number,
    userId: number,
    title: string,
    description: string,
    status: StatusEnum = StatusEnum.OFF_AIR, // 기본값 설정
    viewerCount: number = 0,
    scheduledTime: Date | null = null,
    tags: string[] = [],
    thumbnailUrl: string,
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.status = status;
    this.viewerCount = viewerCount;
    this.scheduledTime = scheduledTime;
    this.tags = tags;
    this.thumbnailUrl = thumbnailUrl;
  }

  // 상태를 변경하는 도메인 메서드
  startBroadcast() {
    if (this.status === StatusEnum.OFF_AIR) {
      this.status = StatusEnum.LIVE;
    }
  }

  scheduleBroadcast(scheduledTime: Date) {
    if (this.status === StatusEnum.OFF_AIR) {
      this.status = StatusEnum.SCHEDULED;
      this.scheduledTime = scheduledTime;
    }
  }

  endBroadcast() {
    if (this.status === StatusEnum.LIVE) {
      this.status = StatusEnum.OFF_AIR;
      this.viewerCount = 0;
    }
  }

  updateViewerCount(count: number) {
    if (this.status === StatusEnum.LIVE) {
      this.viewerCount = count;
    }
  }
}
