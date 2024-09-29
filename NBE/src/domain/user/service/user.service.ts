import { Inject, Injectable } from '@nestjs/common';
import { UserRepository, UserRepositorySymbol } from '../interface/user.repository';
import { UserDomain } from '../model/user.domain';
import { Nullable } from 'src/common/type/native';

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
      throw new Error('User not found');
    }

    // 비밀번호 검증
    if (user.password && user.password === password) {
      // 해시 처리 필요
      // 로그인 성공 시 JWT 토큰 반환
      return user.issueToken();
    }

    // 비밀번호 불일치 시 null 반환
    return null;
  }

  // 사용자 정보 업데이트 (비밀번호 변경, 상태 변경 등)
  async updateUser(userData: UserDomain): Promise<UserDomain> {
    return await this.userRepository.update(userData);
  }
}
