import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignUpResponseDto } from './dto/signup-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 회원가입 API
   */
  @Post('signup')
  signUp(@Body() signupDto: SignUpDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(signupDto);
  }

  /**
   * 로그인 API
   */
  @Post('login')
  login() {
    //this.authService.login();
  }
}
