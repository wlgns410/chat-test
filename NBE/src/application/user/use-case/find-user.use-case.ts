import { Injectable } from '@nestjs/common';
import { UserService } from '../../../domain/user/service/user.service';
import { UserDomain } from '../../../domain/user/model/user.domain';
import { Nullable } from 'src/common/type/native';

@Injectable()
export class FindUserByIdUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(id: number): Promise<Nullable<UserDomain>> {
    // ID로 사용자 조회
    return await this.userService.findUserById(id);
  }
}
