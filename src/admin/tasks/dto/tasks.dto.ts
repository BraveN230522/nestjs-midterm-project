import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
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

export class FilterTaskDto {
  @IsOptional()
  search: string;
}

// export class GetTaskDto {
//   uuid: string;
// }
