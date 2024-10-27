import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../src/interface/presentation/user/controller/user.controller';
import { UserService } from '../../../src//domain/user/service/user.service';
import { UserDomain } from '../../../src//domain/user/model/user.domain';
import { LoginUserDto } from '../../../src/interface/presentation/user/dto/request/login.request';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/common/guard/auth.guard';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: { findUserById: jest.fn(), registerUser: jest.fn(), loginUser: jest.fn(), updateUser: jest.fn() } },
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() } },
        {
          provide: AuthGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      const user = new UserDomain(1, 'JohnDoe', 'johndoe@example.com', 'active', 'admin');
      jest.spyOn(userService, 'findUserById').mockResolvedValueOnce(user);

      const result = await userController.getUserById(1);

      expect(result).toEqual(user);
      expect(userService.findUserById).toHaveBeenCalledWith(1);
    });
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const user = new UserDomain(1, 'JohnDoe', 'johndoe@example.com', 'active', 'admin');
      jest.spyOn(userService, 'registerUser').mockResolvedValueOnce(user);

      const result = await userController.registerUser(user);

      expect(result).toEqual(user);
      expect(userService.registerUser).toHaveBeenCalledWith(user);
    });
  });

  describe('loginUser', () => {
    it('should return a token on successful login', async () => {
      const loginDto: LoginUserDto = { email: 'johndoe@example.com', password: 'password' };
      jest.spyOn(userService, 'loginUser').mockResolvedValueOnce('valid-token');

      const result = await userController.loginUser(loginDto);

      expect(result).toEqual({ token: 'valid-token' });
      expect(userService.loginUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });

    it('should return null if login fails', async () => {
      const loginDto: LoginUserDto = { email: 'johndoe@example.com', password: 'wrong-password' };
      jest.spyOn(userService, 'loginUser').mockResolvedValueOnce(null);

      const result = await userController.loginUser(loginDto);

      expect(result).toEqual({ token: null });
    });
  });
});
