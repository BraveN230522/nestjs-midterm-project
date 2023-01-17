import { IsDate, IsNumber } from 'class-validator';
import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseTable {
  @PrimaryGeneratedColumn('increment')
  @IsNumber()
  public id: number;

  @Column({
    type: 'time without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @CreateDateColumn({ type: 'time without time zone' })
  @IsDate()
  public createdAt: Date;

  @Column({
    type: 'time without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @CreateDateColumn({ type: 'time without time zone' })
  @IsDate()
  public updatedAt: Date;
}
