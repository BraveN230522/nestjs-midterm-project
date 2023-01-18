import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserStatus } from '../../../enums';

export class CreateProjectDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  slug: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'The start date from should be date' })
  startDate: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'The end date from should be date' })
  endDate: string;
}

export class GetProjectsDto {
  @IsOptional()
  page: string;

  @IsOptional()
  perPage: string;
}

export class UserTasksDto {
  @IsOptional()
  page: string;

  @IsOptional()
  perPage: string;
}

// export class GetUserDto {
//   uuid: string;
// }
