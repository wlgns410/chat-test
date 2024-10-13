import { Nullable } from 'src/common/type/native';
import { ChatDomain } from '../../../domain/chat/model/chat.domain';
import { PaginationRequest } from '../../../common/pagination/pagination-request';
import { PaginationResponse } from '../../../common/pagination/pagination-builder';

export const ChatRepositorySymbol = Symbol.for('ChatRepository');

export interface ChatRepositoy {
  createChat(chatDomain: ChatDomain): Promise<ChatDomain>;
  getUserChatsInBroadcast(userId: number, broadcastId: number, pagination: PaginationRequest): Promise<PaginationResponse<ChatDomain>>;
  getAllChatsInBroadcast(broadcastId: number, pagination: PaginationRequest): Promise<PaginationResponse<ChatDomain>>;
}
