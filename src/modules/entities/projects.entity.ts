import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseTable } from '../../base';
import { Task } from './tasks.entity';
import { User } from './users.entity';

@Entity()
export class Project extends BaseTable {
  constructor(partial: Partial<Project>) {
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
  slug: string;

  @Column({ type: 'timestamp with time zone' })
  startDate: Date;

  @Column({ type: 'timestamp with time zone' })
  endDate: Date;

  @OneToMany(() => Task, (tasks) => tasks.project)
  tasks: Task[];

  @ManyToMany(() => User, (user) => user.id, { cascade: true })
  @JoinTable({
    name: 'users_projects',
    joinColumn: { name: 'projectId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  users: User[];
}
