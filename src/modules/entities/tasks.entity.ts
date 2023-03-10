import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from 'typeorm';
import { BaseTable } from '../../base';
import { Priority } from './priorities.entity';
import { Project } from './projects.entity';
import { Status } from './statuses.entity';
import { Type } from './types.entity';
import { User } from './users.entity';

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

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  user: User;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  project: Project;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => Status, (status) => status.tasks, { onDelete: 'CASCADE' })
  status: Status;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => Priority, (priority) => priority.tasks, { onDelete: 'CASCADE' })
  priority: Priority;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => Type, (type) => type.tasks, { onDelete: 'CASCADE' })
  type: Type;
}
