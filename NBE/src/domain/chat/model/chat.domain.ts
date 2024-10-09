import dayjs from 'dayjs';

export class ChatDomain {
  // 필요한 속성들을 정의
  public readonly id: number;
  public readonly userId: number;
  public readonly broadcastId: number;
  public message: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  // 생성자를 통해 ChatDomain 객체를 초기화
  constructor(id: number, userId: number, broadcastId: number, message: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.userId = userId;
    this.broadcastId = broadcastId;
    this.message = message;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // 이걸 mapper에서 하는게 맞지 않을까? 추후 생각
  updateMessage(newMessage: string) {
    this.message = newMessage;
    this.updatedAt = dayjs().toDate(); // 메시지가 수정된 시점을 업데이트
  }

  // 도메인 로직 추가
}
