import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class BroadcastGateway {
  @WebSocketServer()
  server: Server;

  // 방송 시작
  @SubscribeMessage('startBroadcast')
  handleStartBroadcast(@MessageBody() broadcastId: string, @ConnectedSocket() client: Socket): void {
    client.join(broadcastId); // 클라이언트를 방송 방에 추가
    this.server.to(broadcastId).emit('broadcastMessage', `Broadcast ${broadcastId} has started`); // 방송 시작 알림
  }

  // 방송 상태 업데이트 (예: 방송 중 상태 업데이트)
  @SubscribeMessage('updateBroadcast')
  handleUpdateBroadcast(@MessageBody() { broadcastId, status }: { broadcastId: string; status: string }): void {
    this.server.to(broadcastId).emit('broadcastStatus', `Broadcast ${broadcastId} status: ${status}`); // 방송 상태 업데이트 알림
  }

  // 모든 유저를 내보냄 TODO : chat과 묶어서
  @SubscribeMessage('endBroadcast')
  async handleEndBroadcast(@MessageBody() broadcastId: string): Promise<void> {
    // 방송 종료 메시지 전송
    this.server.to(broadcastId).emit('broadcastMessage', `Broadcast ${broadcastId} has ended`);

    // 방송 방에 있는 모든 소켓 클라이언트를 나가게 처리
    const clients = await this.server.in(broadcastId).fetchSockets(); // 방송에 있는 모든 클라이언트를 가져옴
    clients.forEach(client => {
      client.leave(broadcastId); // 모든 클라이언트를 방송 방에서 떠나게 처리하는게 맞을듯?
    });
  }

  // 개별 유저를 내보냄 : chat과 묶어서
  @SubscribeMessage('leaveBroadcast')
  handleLeaveBroadcast(@MessageBody() userId: string, @ConnectedSocket() client: Socket): void {
    client.leave(userId);
  }
}
