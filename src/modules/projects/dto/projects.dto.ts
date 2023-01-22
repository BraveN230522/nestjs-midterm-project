import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, MinDate, ValidateIf } from 'class-validator';
import moment from 'moment';

export class CreateProjectDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  slug: string;

  @IsNotEmpty()
  // @IsDateString({}, { message: 'The start date from should be date' })
  @ValidateIf((obj) => {
    const endDate = moment(obj.endDate, 'YYYY-MM-DD').toISOString();
    const startDate = moment(obj.startDate, 'YYYY-MM-DD').toISOString();
    const diffTime = moment(startDate).diff(endDate);

    console.log({ diffTime });
    return diffTime ? diffTime <= 0 : true;
  })
  startDate: string;

  @IsNotEmpty()
  // @IsDateString({}, { message: 'The end date from should be date' })
  endDate: string;
}

export class UpdateProjectDto {
  @IsOptional()
  name: string;

  @IsOptional()
  slug: string;

  @IsOptional()
  // @IsDateString({}, { message: 'The start date from should be date' })
  @ValidateIf((obj) => {
    const endDate = moment(obj.endDate, 'YYYY-MM-DD').toISOString();
    const startDate = moment(obj.startDate, 'YYYY-MM-DD').toISOString();
    const diffTime = moment(startDate).diff(endDate);

    console.log({ diffTime });
    return diffTime ? diffTime <= 0 : true;
  })
  startDate: string;

  @IsOptional()
  // @IsDateString({}, { message: 'The end date from should be date' })
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
