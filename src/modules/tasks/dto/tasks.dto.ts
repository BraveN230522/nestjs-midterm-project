import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  userId: string;

  @IsNotEmpty()
  startDate: string;

  @IsNotEmpty()
  endDate: string;
}

export class FilterTaskDto {
  @IsOptional()
  page: string;

  @IsOptional()
  perPage: string;
}

// export class GetTaskDto {
//   uuid: string;
// }
