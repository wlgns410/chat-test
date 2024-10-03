import { Nullable } from 'src/common/type/native';
import { UserDomain } from '../model/user.domain';

export const UserRepositorySymbol = Symbol.for('UserRepository');

export interface UserRepository {
  findOneById(id: number): Promise<Nullable<UserDomain>>;
  findOneByEmail(email: string): Promise<Nullable<UserDomain>>;
  save(userDomain: UserDomain): Promise<UserDomain>;
}
