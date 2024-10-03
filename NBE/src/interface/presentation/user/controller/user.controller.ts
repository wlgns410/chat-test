import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { UserService } from '../../../../domain/user/service/user.service';
import { UserDomain } from '../../../../domain/user/model/user.domain';
import { Nullable } from '../../../../common/type/native';
import { AuthGuard } from '../../../../common/guard/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginUserDto } from '../dto/request/login.request';
import { UserResponseDto } from '../dto/response/user.response';
import { CustomException } from 'src/common/exception/custom.exception';
import { ErrorCode } from 'src/common/enum/error-code.enum';

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
  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<Nullable<UserResponseDto>> {
    const user = await this.userService.findUserById(id);

    if (!user) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }

    return new UserResponseDto(user); // 비밀번호를 제외한 정보만 반환
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
}
