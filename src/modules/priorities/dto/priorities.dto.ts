import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreatePriorityDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Transform(({ value }) => (Number.isNaN(+value) ? 0 : +value)) // this field will be parsed to integer when `plainToClass gets called`
  @IsNumber()
  @IsInt()
  order: number;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    return value.toLowerCase() === 'true' || false;
  })
  isShow: boolean;
}

export class UpdatePriorityDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @Transform(({ value }) => (Number.isNaN(+value) ? 0 : +value)) // this field will be parsed to integer when `plainToClass gets called`
  @IsNumber()
  @IsInt()
  order: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return value.toLowerCase() === 'true' || false;
  })
  isShow: boolean;
}

export class GetPriorityDto {
  @IsOptional()
  page: string;

  @IsOptional()
  perPage: string;
}
