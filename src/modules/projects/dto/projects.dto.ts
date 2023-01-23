import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, MinDate, ValidateIf } from 'class-validator';
import { IsDateGreaterThan } from '../../../common';

export class CreateProjectDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  slug: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'The start date should be date' })
  startDate: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'The end date should be date' })
  @IsDateGreaterThan('startDate', { message: 'The end date must be greater than the start date' })
  endDate: string;
}

export class UpdateProjectDto {
  @IsOptional()
  name: string;

  @IsOptional()
  slug: string;

  @IsOptional()
  @IsDateString({}, { message: 'The start date should be date' })
  startDate: string;

  @IsOptional()
  @IsDateString({}, { message: 'The end date should be date' })
  @IsDateGreaterThan('startDate', { message: 'The end date must be greater than the start date' })
  endDate: string;
}

export class AddMembersDto {
  @IsNotEmpty()
  @IsInt({ each: true })
  @Transform((params) => {
    return params.value.split(',').map(Number);
  })
  memberIds: number[];
}

export class RemoveMembersDto {
  @IsNotEmpty()
  @IsInt({ each: true })
  @Transform((params) => {
    return params.value.split(',').map(Number);
  })
  memberIds: number[];
}

export class GetProjectsDto {
  @IsOptional()
  page: string;

  @IsOptional()
  perPage: string;
}

export class GetProjectMembersDto {
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
