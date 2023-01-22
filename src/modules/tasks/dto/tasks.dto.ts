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

export class GetTaskDto {
  @IsOptional()
  page: string;

  @IsOptional()
  perPage: string;
}

// export class GetTaskDto {
//   uuid: string;
// }
