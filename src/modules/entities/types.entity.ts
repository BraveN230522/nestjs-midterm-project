import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTable } from '../../base';
import { Task } from './tasks.entity';

@Entity()
export class Type extends BaseTable {
  constructor(partial: Partial<Type>) {
    super();
    Object.assign(this, partial);
  }

  @Column()
  name: string;

  @Column()
  color: string;

  @Column({ type: 'bool' })
  isShow: boolean;

  @OneToMany(() => Task, (task) => task.status)
  tasks: Task[];
}
