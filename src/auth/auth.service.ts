import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '@/entities/member.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/signup.dto';
import { LoggingService } from '@/logging/logging.service';
import { hash } from 'bcrypt';
import { SignUpResponseDto } from './dto/signup-response.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: LoggingService,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    const { name, username, password, email } = signUpDto;

    await this.checkDuplicatedUser(username, email);
    const hashedPassword = await this.hashPassword(password);

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

  private hashPassword(password: string): Promise<string> {
    // 비밀번호 해싱 - auth gen salt
    return hash(password, SALT_ROUNDS);
  }
}
