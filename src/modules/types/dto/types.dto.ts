import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTypeDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  color: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    return value.toLowerCase() === 'true' || false;
  })
  isShow: boolean;
}

export class UpdateTypeDto {
  @IsOptional()
  name: string;

  @IsOptional()
  color: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return value.toLowerCase() === 'true' || false;
  })
  isShow: boolean;
}

export class GetTypeDto {
  @IsOptional()
  page: string;

  @IsOptional()
  perPage: string;
}
