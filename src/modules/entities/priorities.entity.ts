import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTable } from '../../base';
import { Task } from './tasks.entity';

@Entity()
export class Priority extends BaseTable {
  constructor(partial: Partial<Priority>) {
    super();
    Object.assign(this, partial);
  }

  @Column()
  name: string;

  @Column()
  order: number;

  @Column({ type: 'bool' })
  isShow: boolean;

  @OneToMany(() => Task, (task) => task.priority)
  tasks: Task[];
}
