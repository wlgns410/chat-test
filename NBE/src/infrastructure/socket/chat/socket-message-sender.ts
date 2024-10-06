import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // 유저가 채팅방에 참여하는 이벤트 처리
  @SubscribeMessage('join')
  handleJoin(@MessageBody() roomId: string, @ConnectedSocket() client: Socket): void {
    client.join(roomId);
    this.server.to(roomId).emit('message', `${client.id} joined the chat`); // 방에 있는 다른 사용자에게 알림
  }

  // 메시지 전송 이벤트 처리
  @SubscribeMessage('message')
  handleMessage(@MessageBody() { roomId, message }: { roomId: string; message: string }, @ConnectedSocket() client: Socket): void {
    this.server.to(roomId).emit('message', message); // 해당 방의 모든 클라이언트에게 메시지 전송
  }

  // 유저가 채팅방을 떠날 때 처리
  @SubscribeMessage('leave')
  handleLeave(@MessageBody() roomId: string, @ConnectedSocket() client: Socket): void {
    client.leave(roomId);
  }

  // TODO : 클라이언트 연결이 끊어질 때 처리(재시도 or 자신에게만 보이는 메시지 남기기)
  handleDisconnect(@ConnectedSocket() client: Socket): void {
    console.log(`${client.id} disconnected`);
  }

  //   TODO : 유저가 강제로 채팅방에서 퇴장 당할 때 처리
  //   @SubscribeMessage('forceLeave')
  //   handleForceLeave(@MessageBody() roomId: string, @ConnectedSocket() client: Socket): void {
  //     client.leave(roomId);
  //     this.server.to(roomId).emit('message', `${client.id} was forcibly removed from the chat`); // 방에 있는 다른 사용자에게 알림
  //   }
}
