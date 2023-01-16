import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  startDate: string;

  @IsNotEmpty()
  endDate: string;
}

export class FilterTaskDto {
  @IsOptional()
  search: string;
}

// export class GetTaskDto {
//   uuid: string;
// }
