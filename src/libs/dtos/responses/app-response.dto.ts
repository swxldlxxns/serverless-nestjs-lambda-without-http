import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AppResponseDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly message: string;
}
