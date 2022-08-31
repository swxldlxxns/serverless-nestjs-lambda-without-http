import { Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class AppRequestsDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @Expose()
  readonly date: Date;

  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly code: string;
}
