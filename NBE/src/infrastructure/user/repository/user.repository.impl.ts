import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Nullable } from '../../../common/type/native';
import { UserDomain } from 'src/domain/user/model/user.domain';
import { UserMapper } from '../mapper/user.mapper';
import { UserRepository } from '../../../domain/user/interface/user.repository';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // ID로 유저 찾기
  async findOneById(id: number): Promise<Nullable<UserDomain>> {
    const entity = await this.userRepository.findOne({ where: { id } });

    // 유저가 존재하면 매퍼를 통해 도메인으로 변환
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findOneByEmail(email: string): Promise<Nullable<UserDomain>> {
    const entity = await this.userRepository.findOne({ where: { email } });

    // 유저가 존재하면 매퍼를 통해 도메인으로 변환
    return entity ? UserMapper.toDomain(entity) : null;
  }

  // 회원가입용 유저 저장
  async save(userQueue: UserDomain): Promise<UserDomain> {
    // 매퍼를 통해 UserQueue -> UserEntity 변환 후 저장
    const entity = await this.userRepository.save(await UserMapper.toSignUpEntity(userQueue));

    // 저장 후 반환된 엔티티를 다시 도메인 객체로 변환
    return UserMapper.toDomain(entity);
  }

  // 비밀번호 변경과 같은 부분 업데이트 처리
  async update(userDomain: UserDomain): Promise<UserDomain> {
    // 도메인에서 ID를 추출하여 해당 엔티티를 조회
    const entity = await this.userRepository.findOne({ where: { id: userDomain.id } });

    // 엔티티가 존재하지 않을 경우 처리
    if (!entity) {
      throw new Error('User not found');
    }

    // 부분 업데이트를 처리할 매퍼 메서드 호출
    const updatedEntity = await UserMapper.toPartialEntity(userDomain, entity);

    // 업데이트된 엔티티 저장
    const savedEntity = await this.userRepository.save(updatedEntity);

    // 저장된 엔티티를 다시 도메인 객체로 변환하여 반환
    return UserMapper.toDomain(savedEntity);
  }
}
