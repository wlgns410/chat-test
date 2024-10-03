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
}
