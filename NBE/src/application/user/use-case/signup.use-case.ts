import { Injectable } from '@nestjs/common';
import { UserService } from '../../../domain/user/service/user.service';
import { UserDomain } from '../../../domain/user/model/user.domain';

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(userData: UserDomain): Promise<UserDomain> {
    // 회원가입 처리
    return await this.userService.registerUser(userData);
  }
}
