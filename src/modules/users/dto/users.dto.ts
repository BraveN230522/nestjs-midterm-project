import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserStatus } from '../../../enums';

export class CreateUserDto {
  @IsNotEmpty()
  @IsInt({ each: true })
  @Transform((params) => params.value.split(',').map(Number))
  defaultProjects: number[];
}

export class UpdateUserDto {
  @IsOptional()
  @IsInt({ each: true })
  @Transform((params) => params.value.split(',').map(Number))
  defaultProjects: number[];

  @IsOptional()
  name: string;

  @IsOptional()
  username: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  password: string;

  @IsOptional()
  @IsEnum(UserStatus)
  @Transform(({ value }) => Number.parseInt(value))
  @Type(() => Number)
  @IsInt()
  status: UserStatus;

  @IsOptional()
  token: string;
}

export class RegisterUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  password: string;
}

export class GetUserDto {
  @IsOptional()
  page: string;

  @IsOptional()
  perPage: string;
}

export class GetUserTasksDto {
  @IsOptional()
  page: string;

  @IsOptional()
  perPage: string;
}

export class GetUserProjectsDto {
  @IsOptional()
  page: string;

  @IsOptional()
  perPage: string;
}
