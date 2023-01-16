import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserStatus } from '../../../enums';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  password: string;

  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus;
}

export class FilterUserDto {
  @IsOptional()
  search: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status: UserStatus;
}

// export class GetUserDto {
//   uuid: string;
// }
