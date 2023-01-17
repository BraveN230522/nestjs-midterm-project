import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from 'typeorm';
import { BaseTable } from '../../base';
import { User } from '../users/users.entity';

@Entity()
export class Task extends BaseTable {
  constructor(partial: Partial<Task>) {
    super();
    Object.assign(this, partial);
  }

  @Column()
  name: string;

  @Column({ type: 'timestamp with time zone' })
  startDate: Date;

  @Column({ type: 'timestamp with time zone' })
  endDate: Date;

  // @Exclude({ toPlainOnly: true })
  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  user: User;
}
