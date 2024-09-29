import * as jwt from 'jsonwebtoken';

export class UserDomain {
  constructor(
    public id: number,
    public username: string,
    public email: string,
    public status: string,
    public role: string,
    public password?: string,
  ) {}

  // 비밀번호를 반환하지 않는 도메인 생성 메서드
  static toLogin(id: number, username: string, email: string, status: string, role: string): UserDomain {
    return new UserDomain(id, username, email, status, role);
  }

  issueToken(): string {
    return jwt.sign({ userId: this.id, username: this.username }, process.env.JWT_USER_SECRET || 'test', { expiresIn: '1M' });
  }
}
