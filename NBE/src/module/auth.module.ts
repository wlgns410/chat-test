import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../common/guard/auth.guard';
import { UserModule } from '../module/user.module';

@Module({
  imports: [UserModule, JwtModule.register({ global: true })],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
