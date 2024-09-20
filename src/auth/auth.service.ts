import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '@/entities/member.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/signup.dto';
import { LoggingService } from '@/logging/logging.service';
import { hash, compare } from 'bcrypt';
import { SignUpResponseDto } from './dto/signup-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: LoggingService,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    const { name, username, password, email } = signUpDto;

    await this.checkDuplicatedUser(username, email);
    const hashedPassword = await hash(password, SALT_ROUNDS);

    const result = await this.memberRepository.insert({
      name,
      username,
      password: hashedPassword,
      email,
    });

    this.logger.log(`sign up success: { id: ${result.identifiers[0].id}, username: ${username} }`, 'AuthService');
    return {
      id: result.identifiers[0].id,
      name,
      username,
      email,
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const member = await this.memberRepository.findOne({
      select: ['id', 'name', 'username', 'password'],
      where: { username },
    });

    if (member === null) {
      throw new UnauthorizedException('유효하지 않은 아이디입니다. 아이디를 확인해주세요.');
    }

    const isPasswordMatched = await compare(password, member.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다. 비밀번호를 확인해주세요.');
    }
    const token = this.jwtService.sign({ sub: member.id, username: member.username, name: member.name });
    this.logger.log(`login success: { id: ${member.id}, username: ${member.username} }`, 'AuthService');
    return { accessToken: token };
  }

  private async checkDuplicatedUser(username: string, email: string): Promise<void> {
    const duplicatedUser = await this.memberRepository.findOne({
      select: ['email', 'username'],
      where: [{ username }, { email }],
    });

    if (duplicatedUser !== null) {
      if (username === duplicatedUser.username) {
        throw new ConflictException('이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.');
      }
      if (email === duplicatedUser.email) {
        throw new ConflictException('이미 사용 중인 이메일 주소 입니다. 다른 이메일 주소를 입력해주세요.');
      }
    }
  }
}
