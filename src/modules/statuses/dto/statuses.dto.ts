import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { IsDateGreaterThan } from '../../../common';

export class CreateStatusDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  userId: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'The start date should be date' })
  startDate: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'The end date should be date' })
  @IsDateGreaterThan('startDate', { message: 'The end date must be greater than the start date' })
  endDate: string;
}

export class UpdateStatusDto {
  @IsOptional()
  name: string;

  @IsOptional()
  userId: string;

  @IsOptional()
  @IsDateString({}, { message: 'The start date should be date' })
  startDate: string;

  @IsOptional()
  @IsDateString({}, { message: 'The end date should be date' })
  @IsDateGreaterThan('startDate', { message: 'The end date must be greater than the start date' })
  endDate: string;
}

export class GetStatusDto {
  @IsOptional()
  page: string;

  @IsOptional()
  perPage: string;
}

// export class GetStatusDto {
//   uuid: string;
// }
