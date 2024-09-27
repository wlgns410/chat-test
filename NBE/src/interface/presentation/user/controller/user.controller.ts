import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { RegisterUserUseCase } from '../../../../application/user/use-case/signup.use-case';
import { LoginUserUseCase } from '../../../../application/user/use-case/login.use-case';
import { FindUserByIdUseCase } from '../../../../application/user/use-case/find-user.use-case';
import { UpdateUserUseCase } from '../../../../application/user/use-case/update-user.use-case';
import { UserDomain } from '../../../../domain/user/model/user.domain';
import { Nullable } from '../../../../common/type/native';

@Controller('users')
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  // 사용자 조회
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<Nullable<UserDomain>> {
    return await this.findUserByIdUseCase.execute(id);
  }

  // 회원가입
  @Post('register')
  async registerUser(@Body() userData: UserDomain): Promise<UserDomain> {
    return await this.registerUserUseCase.execute(userData);
  }

  // 로그인
  @Post('login')
  async loginUser(@Body('email') email: string, @Body('password') password: string): Promise<{ token: string | null }> {
    const token = await this.loginUserUseCase.execute(email, password);
    return { token };
  }

  // 사용자 정보 업데이트
  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() userData: UserDomain): Promise<UserDomain> {
    return await this.updateUserUseCase.execute(userData);
  }
}
