import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  // 클라이언트가 연결될 때 JWT 토큰 검증
  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        throw new UnauthorizedException('토큰이 없습니다.');
      }

      // JWT 토큰 검증
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      client.data.user = decoded; // 검증된 유저 정보 저장
      console.log(`User ${decoded.username} connected`);
    } catch (error) {
      client.disconnect(); // 토큰 검증 실패 시 연결 해제
      console.error('JWT 인증 실패:', error);
    }
  }

  // 유저가 채팅방에 참여하는 이벤트 처리 -> room join 대신 redis에 메시지 적재시키고 이를 kafka로 전달하는 방식으로?
  @SubscribeMessage('join')
  handleJoin(@MessageBody() broadcastId: string, @ConnectedSocket() client: Socket): void {
    const user = client.data.user; // 인증된 유저 정보 사용
    if (user) {
      client.join(broadcastId);
      this.server.to(broadcastId).emit('message', `${user.username} joined the chat`); // 방에 있는 다른 사용자에게 알림
    } else {
      client.disconnect();
    }
  }

  // 메시지 전송 이벤트 처리
  @SubscribeMessage('message')
  handleMessage(@MessageBody() { broadcastId, message }: { broadcastId: string; message: string }, @ConnectedSocket() client: Socket): void {
    const user = client.data.user; // 인증된 유저 정보 사용
    if (user) {
      this.server.to(broadcastId).emit('message', `${user.username}: ${message}`); // 해당 방의 모든 클라이언트에게 메시지 전송
    }
  }

  // 유저가 채팅방을 떠날 때 처리
  @SubscribeMessage('leave')
  handleLeave(@MessageBody() broadcastId: string, @ConnectedSocket() client: Socket): void {
    const user = client.data.user;
    if (user) {
      client.leave(broadcastId);
      this.server.to(broadcastId).emit('message', `${user.username} left the chat`);
    } else {
      client.disconnect();
    }
  }

  // TODO : 클라이언트 연결이 끊어질 때 처리(재시도 or 자신에게만 보이는 메시지 남기기)
  handleDisconnect(@ConnectedSocket() client: Socket): void {
    const user = client.data.user;
    if (user) {
      console.log(`User ${user.username} disconnected`);
      // 필요하다면, 연결이 끊긴 후에도 사용자 정보로 로그를 남기거나 재연결 등을 처리할 수 있습니다.
    } else {
      console.log(`Unknown user disconnected`);
    }
  }

  //   TODO : 유저가 강제로 채팅방에서 퇴장 당할 때 처리
  //   @SubscribeMessage('forceLeave')
  //   handleForceLeave(@MessageBody() broadcastId: string, @ConnectedSocket() client: Socket): void {
  //     client.leave(broadcastId);
  //     this.server.to(broadcastId).emit('message', `${client.id} was forcibly removed from the chat`); // 방에 있는 다른 사용자에게 알림
  //   }
}
