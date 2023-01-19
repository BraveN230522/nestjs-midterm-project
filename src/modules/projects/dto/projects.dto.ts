import { IsDateString, IsNotEmpty, IsOptional, MinDate, ValidateIf } from 'class-validator';
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
