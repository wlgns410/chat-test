// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserEntity } from 'src/infrastructure/user/entity/user.entity';
// import { UserController } from '../interface/presentation/user/controller/user.controller';
// import { UserService } from '../domain/user/service/user.service';

// @Module({
//   imports: [TypeOrmModule.forFeature([UserEntity])],
//   controllers: [UserController],
//   providers: [UserService],
//   exports: [UserService],
// })
// export class UserModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/infrastructure/user/entity/user.entity';
import { UserController } from '../interface/presentation/user/controller/user.controller';
import { UserService } from '../domain/user/service/user.service';
import { UserRepositorySymbol } from '../domain/user/interface/user.repository';
import { UserRepositoryImpl } from '../infrastructure/user/repository/user.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])], // TypeORM을 통해 UserEntity 사용
  controllers: [UserController],
  providers: [
    UserService, // UserService 등록
    { provide: UserRepositorySymbol, useClass: UserRepositoryImpl }, // UserRepositoryImpl을 UserRepositorySymbol로 주입
  ],
  exports: [UserService],
})
export class UserModule {}
