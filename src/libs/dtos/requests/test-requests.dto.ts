import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class TestRequestsDto {
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  readonly email: string;
}
