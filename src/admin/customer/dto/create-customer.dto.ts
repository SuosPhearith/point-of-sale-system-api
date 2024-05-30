import {
  IsString,
  IsOptional,
  IsEmail,
  IsInt,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Gender } from 'src/auth/enum/gender.enum';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsInt()
  @IsOptional()
  point?: number = 0;

  @IsBoolean()
  @IsOptional()
  status?: boolean = true;

  @IsEnum(Gender)
  gender: Gender;
}
