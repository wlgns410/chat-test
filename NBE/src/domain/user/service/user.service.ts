import { Inject, Injectable } from '@nestjs/common';
import { UserRepository, UserRepositorySymbol } from '../interface/user.repository';
import { UserDomain } from '../model/user.domain';
import { Nullable } from '../../../common/type/native';
import * as bcrypt from 'bcrypt';
import { CustomException } from '../../../common/exception/custom.exception';
import { ErrorCode } from '../../../common/enum/error-code.enum';


@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepositorySymbol)
    private readonly userRepository: UserRepository, // UserRepository 의존성 주입
  ) {}

  // ID로 사용자 조회
  async findUserById(id: number): Promise<Nullable<UserDomain>> {
    return await this.userRepository.findOneById(id);
  }

  // 회원가입
  async registerUser(userData: UserDomain): Promise<UserDomain> {
    // 회원가입 시 저장된 도메인 반환
    return await this.userRepository.save(userData);
  }

  // 로그인 처리
  async loginUser(email: string, password: string): Promise<Nullable<string>> {
    // 이메일로 사용자 찾기
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }

    // 비밀번호 검증
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return user.issueToken();
      }
    } else {
      throw new CustomException(ErrorCode.NOT_FOUND);

    }

    // 비밀번호 불일치 시 null 반환
    return null;
  }
}
