import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Role, UserStatus } from '../../enums';
import { Auth } from '../auth/auth.entity';
import { Exclude } from 'class-transformer';
import { Task } from '../tasks/tasks.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name?: string;

  @Column()
  status: UserStatus;

  @OneToMany(() => Task, (tasks) => tasks.user)
  tasks: Task[];

  @OneToOne(() => Auth, { cascade: true })
  @JoinColumn()
  @Exclude({ toPlainOnly: true })
  auth: Auth;
}
