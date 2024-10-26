import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from '../../../src/interface/presentation/chat/controller/chat.controller';
import { ChatService } from '../../../src/domain/chat/service/chat.service';
import { ChatDomain } from '../../../src/domain/chat/model/chat.domain';
import { PaginationRequest } from '../../../src/common/pagination/pagination-request';
import { PaginationBuilder } from '../../../src/common/pagination/pagination-builder';
import { AuthGuard } from '../../../src/common/guard/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('ChatController', () => {
  let chatController: ChatController;
  let chatService: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        { provide: ChatService, useValue: { createChat: jest.fn(), getUserChatsInBroadcast: jest.fn(), getAllChatsInBroadcast: jest.fn() } },
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() } },
        {
          provide: AuthGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) },
        },
      ],
    }).compile();

    chatController = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);
  });

  describe('createChat', () => {
    it('should create a new chat successfully', async () => {
      const chat = new ChatDomain(1, 1, 1, 'test message', new Date(), new Date());
      jest.spyOn(chatService, 'createChat').mockResolvedValueOnce(chat);

      const result = await chatController.createChat(chat);

      expect(result).toEqual(chat);
      expect(chatService.createChat).toHaveBeenCalledWith(chat);
    });
  });

  describe('getUserChatsInBroadcast', () => {
    it('should return user chats in a broadcast', async () => {
      const broadcastId = 1;
      const userId = 13;

      // PaginationRequest를 생성
      const paginationRequest = new PaginationRequest();

      // 테스트용 ChatDomain 데이터
      const chatDomains = [new ChatDomain(1, userId, broadcastId, 'test message', new Date(), new Date())];

      // PaginationResponse를 생성할 때 PaginationBuilder를 사용
      const paginationResponse = new PaginationBuilder<ChatDomain>()
        .setData(chatDomains)
        .setPage(paginationRequest.page)
        .setTake(paginationRequest.take)
        .setTotalCount(1) // 데이터의 총 갯수를 설정
        .build();

      jest.spyOn(chatService, 'getUserChatsInBroadcast').mockResolvedValueOnce(paginationResponse);

      // 두 개의 인자를 함께 전달
      const result = await chatController.getUserChatsInBroadcast(broadcastId, userId, paginationRequest);

      expect(result).toEqual(paginationResponse);
      expect(chatService.getUserChatsInBroadcast).toHaveBeenCalledWith(userId, broadcastId, paginationRequest);
    });
  });
  describe('getAllChatsInBroadcast', () => {
    it('should return all chats in a broadcast', async () => {
      const broadcastId = 1;

      // PaginationRequest 객체 생성
      const paginationRequest = new PaginationRequest();

      // 테스트용 ChatDomain 데이터
      const chatDomains = [new ChatDomain(1, 13, broadcastId, 'test message', new Date(), new Date())];

      // PaginationResponse를 생성할 때 PaginationBuilder를 사용
      const paginationResponse = new PaginationBuilder<ChatDomain>()
        .setData(chatDomains)
        .setPage(paginationRequest.page)
        .setTake(paginationRequest.take)
        .setTotalCount(1) // 총 데이터 갯수 설정
        .build();

      jest.spyOn(chatService, 'getAllChatsInBroadcast').mockResolvedValueOnce(paginationResponse);

      // 호출 시 paginationRequest를 전달
      const result = await chatController.getAllChatsInBroadcast(broadcastId, paginationRequest);

      expect(result).toEqual(paginationResponse);
      expect(chatService.getAllChatsInBroadcast).toHaveBeenCalledWith(broadcastId, paginationRequest);
    });
  });
});
