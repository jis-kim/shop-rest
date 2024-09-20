import { IsNumber, IsOptional, IsString, Length, Max } from 'class-validator';

export class GetProductQueryDto {
  @Max(2147483647, { message: '2147483647보다 작은 값을 입력해주세요.' })
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @IsNumber()
  @Max(1000, { message: '1000보다 작은 값을 입력해주세요.' })
  limit: number = 10;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  brandName?: string;
}
