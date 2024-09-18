import { IsAlphanumeric, IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class SignUpDto {
  @IsString()
  @Length(1, 128, { message: '이름은 최소 1자, 최대 128자까지 입력 가능합니다.' })
  name: string;

  @IsAlphanumeric('en-US', { message: '아이디는 영문자, 숫자만 입력 가능합니다.' })
  @Length(4, 64)
  username: string;

  @IsEmail({}, { message: ({ value }) => `${value}는 유효한 이메일 주소가 아닙니다.` })
  email: string;

  @IsStrongPassword(
    { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 },
    { message: '비밀번호는 최소 8자 이상, 영문 대문자, 소문자, 숫자를 포함해야 합니다.' },
  )
  password: string;
}
