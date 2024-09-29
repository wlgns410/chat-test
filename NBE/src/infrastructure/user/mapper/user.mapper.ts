import { UserEntity } from '../entity/user.entity';
import { UserDomain } from '../../../domain/user/model/user.domain';
import * as bcrypt from 'bcrypt';

export class UserMapper {
  // 회원가입용 UserDomain -> UserEntity 변환
  static async toSignUpEntity(domain: Partial<UserDomain>): Promise<UserEntity> {
    const entity = new UserEntity();
    entity.username = domain.username!;
    entity.email = domain.email!;
    entity.password = await bcrypt.hash(domain.password!, 10);
    return entity;
  }

  // 비밀번호 변경, role, status 변경 등 부분 업데이트용 메서드
  static async toPartialEntity(domain: Partial<UserDomain>, entity: UserEntity): Promise<UserEntity> {
    if (domain.password) {
      entity.password = await bcrypt.hash(domain.password!, 10);
    }
    if (domain.status) {
      entity.status = domain.status;
    }
    if (domain.role) {
      entity.role = domain.role;
    }
    return entity;
  }

  static toDomain(entity: UserEntity): UserDomain {
    return UserDomain.toLogin(entity.id, entity.username, entity.email, entity.status, entity.role);
  }
}
