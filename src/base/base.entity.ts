import { Exclude } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

//ISOstring time
export abstract class BaseTable {
  @PrimaryGeneratedColumn('increment')
  @IsNumber()
  public id: number;

  @Exclude({ toPlainOnly: true })
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  public createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  public updatedAt: Date;
}
