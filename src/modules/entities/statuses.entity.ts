import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTable } from '../../base';
import { Task } from './tasks.entity';

@Entity()
export class Status extends BaseTable {
  constructor(partial: Partial<Status>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    nullable: false,
    unique: true,
  })
  order: number;

  @Column({ type: 'boolean' })
  isShow: boolean;

  @OneToMany(() => Task, (task) => task.status)
  tasks: Task[];
}
