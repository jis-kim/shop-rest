import { IsAlphanumeric, IsByteLength, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @Length(4, 64)
  username: string;

  @IsString()
  @IsByteLength(8, 72) // bcrypt 라이브러리에서 지원하는 최대 길이
  password: string;
}
