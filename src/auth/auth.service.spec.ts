import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoggingService } from '@/logging/logging.service';
import { Member } from '@/entities/member.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { access } from 'fs';

describe('AuthService', () => {
  let service: AuthService;
  let memberRepository: Repository<Member>;
  let logger: LoggingService;

  const mockMemberRepository = {
    findOne: jest.fn(),
    insert: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(Member), useValue: mockMemberRepository },
        { provide: LoggingService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    logger = module.get<LoggingService>(LoggingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('올바른 회원가입 요청 시 회원가입 성공', async () => {
      const mockSignUpDto = {
        name: '홍길동',
        username: 'gildong',
        password: '1234ABCabc',
        email: 'gildong@mock.com',
      };

      mockMemberRepository.findOne.mockResolvedValue(null); // 중복 없음
      mockMemberRepository.insert.mockResolvedValue({
        identifiers: [{ id: '64cf0a61-b7c2-4347-ba94-bc854fd97f2f' }],
      });

      (hash as jest.Mock) = jest.fn().mockResolvedValue('hashedPassword123');

      const result = await service.signUp(mockSignUpDto);

      // checkDuplicatedUser
      expect(mockMemberRepository.findOne).toHaveBeenCalledWith({
        select: ['email', 'username'],
        where: [{ username: mockSignUpDto.username }, { email: mockSignUpDto.email }],
      });

      // 비밀번호 해싱 수행 확인
      expect(hash).toHaveBeenCalledWith(mockSignUpDto.password, 10);

      expect(mockMemberRepository.insert).toHaveBeenCalledWith({
        name: mockSignUpDto.name,
        username: mockSignUpDto.username,
        password: 'hashedPassword123',
        email: mockSignUpDto.email,
      });

      expect(result).toEqual({
        id: '64cf0a61-b7c2-4347-ba94-bc854fd97f2f',
        name: mockSignUpDto.name,
        username: mockSignUpDto.username,
        email: mockSignUpDto.email,
      });
    });

    it('중복된 username이 존재하는 경우 ConflictException 발생', async () => {
      const mockSignUpDto = {
        name: '홍길동',
        username: 'user',
        password: '1234ABCabc',
        email: 'gildong@mock.com',
      };

      mockMemberRepository.findOne.mockResolvedValue({ username: 'user', email: 'mock@mock.com' });

      await expect(service.signUp(mockSignUpDto)).rejects.toThrow(
        new ConflictException('이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.'),
      );
    });

    it('중복된 email이 존재하는 경우 ConflictException 발생', async () => {
      const mockSignUpDto = {
        name: '홍길동',
        username: 'gildong',
        password: '1234ABCabc',
        email: 'mock@mock.com',
      };

      mockMemberRepository.findOne.mockResolvedValue({ username: 'user', email: 'mock@mock.com' });

      await expect(service.signUp(mockSignUpDto)).rejects.toThrow(
        new ConflictException('이미 사용 중인 이메일 주소 입니다. 다른 이메일 주소를 입력해주세요.'),
      );
    });
  });

  describe('login', () => {
    it('올바른 로그인 요청 시 로그인 성공', async () => {
      const mockLoginDto = {
        username: 'gildong',
        password: '1234ABCabc',
      };

      const mockMember = {
        id: '64cf0a61-b7c2-4347-ba94-bc854fd97f2f',
        name: '홍길동',
        username: 'gildong',
        email: 'gildong@mock.com',
        password: 'hashedPassword123',
      };

      mockMemberRepository.findOne.mockResolvedValue(mockMember);
      (hash as jest.Mock) = jest.fn().mockResolvedValue('hashedPassword123');

      const result = await service.login(mockLoginDto);
      expect(result).toEqual({ accessToken: expect.any(String) });
      expect(mockMemberRepository.findOne).toHaveBeenCalledWith({
        select: ['id', 'name', 'username', 'email', 'password'],
        where: { username: mockLoginDto.username },
      });
    });
  });
});
