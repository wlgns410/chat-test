import { Injectable } from '@nestjs/common';
import { UserService } from '../../../domain/user/service/user.service';

@Injectable()
export class LoginUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(email: string, password: string): Promise<string | null> {
    // 로그인 처리
    return await this.userService.loginUser(email, password);
  }
}
