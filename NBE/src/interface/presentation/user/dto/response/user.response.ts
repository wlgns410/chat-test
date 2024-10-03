import { UserDomain } from '../../../../../domain/user/model/user.domain';

export class UserResponseDto {
  id: number;
  username: string;
  email: string;
  status: string;
  role: string;

  constructor(user: UserDomain) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.status = user.status;
    this.role = user.role;
  }
}
