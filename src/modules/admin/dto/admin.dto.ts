import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { UserStatus } from '../../../enums';

export class AdminCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'Password is too weak',
  // })
  password: string;
}

export class CreateAdminDto {
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
