import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { UserStatus } from '../../../enums';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

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
