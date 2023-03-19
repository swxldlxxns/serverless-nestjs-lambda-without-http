import { IsEmail, IsNotEmpty } from 'class-validator';

export class TestResponseDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
