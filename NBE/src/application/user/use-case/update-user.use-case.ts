import { Injectable } from '@nestjs/common';
import { UserService } from '../../../domain/user/service/user.service';
import { UserDomain } from '../../../domain/user/model/user.domain';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(userData: UserDomain): Promise<UserDomain> {
    // 사용자 정보 업데이트
    return await this.userService.updateUser(userData);
  }
}
