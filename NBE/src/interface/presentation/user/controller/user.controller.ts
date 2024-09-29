import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { UserService } from '../../../../domain/user/service/user.service';
import { UserDomain } from '../../../../domain/user/model/user.domain';
import { Nullable } from '../../../../common/type/native';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginUserDto } from '../dto/request/login.request';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService, // UserService를 주입받아서 사용
  ) {}

  // 사용자 조회
  @ApiOperation({ summary: '사용자 조회' })
  @ApiResponse({ status: 200, description: '사용자 정보 조회 성공' })
  @ApiBearerAuth()
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<Nullable<UserDomain>> {
    return await this.userService.findUserById(id);
  }

  // 회원가입
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @Post('register')
  async registerUser(@Body() userData: UserDomain): Promise<UserDomain> {
    return await this.userService.registerUser(userData);
  }

  // 로그인
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  @Post('login')
  async loginUser(@Body() loginData: LoginUserDto): Promise<{ token: string | null }> {
    const token = await this.userService.loginUser(loginData.email, loginData.password);
    return { token };
  }

  // 사용자 정보 업데이트
  @ApiOperation({ summary: '사용자 정보 업데이트' })
  @ApiResponse({ status: 200, description: '사용자 정보 업데이트 성공' })
  @ApiBearerAuth()
  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() userData: UserDomain): Promise<UserDomain> {
    return await this.userService.updateUser(userData);
  }
}
