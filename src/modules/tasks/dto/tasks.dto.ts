import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { IsDateGreaterThan } from '../../../common';

export class CreateTaskDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  typeId: string;

  @IsNotEmpty()
  priorityId: string;

  @IsNotEmpty()
  statusId: string;

  @IsNotEmpty()
  projectId: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'The start date should be date' })
  startDate: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'The end date should be date' })
  @IsDateGreaterThan('startDate', { message: 'The end date must be greater than the start date' })
  endDate: string;
}

export class UpdateTaskDto {
  @IsOptional()
  name: string;

  @IsOptional()
  userId: string;

  @IsOptional()
  typeId: string;

  @IsOptional()
  priorityId: string;

  @IsOptional()
  statusId: string;

  @IsOptional()
  projectId: string;

  @IsOptional()
  @IsDateString({}, { message: 'The start date should be date' })
  startDate: string;

  @IsOptional()
  @IsDateString({}, { message: 'The end date should be date' })
  @IsDateGreaterThan('startDate', { message: 'The end date must be greater than the start date' })
  endDate: string;
}

export class GetTaskDto {
  @IsOptional()
  page: string;

  @IsOptional()
  perPage: string;
}

// export class GetTaskDto {
//   uuid: string;
// }
