import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  Generated,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTable } from '../../base';
import { Role, UserStatus } from '../../enums';
import { Admin } from './admin.entity';
import { Project } from './projects.entity';
import { Task } from './tasks.entity';

@Entity()
export class User extends BaseTable {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Exclude({ toPlainOnly: true })
  @Column({
    nullable: true,
    unique: true,
  })
  @Generated('uuid')
  inviteId?: string;

  @Column({
    nullable: true,
    unique: false,
  })
  name?: string;

  @Column({
    nullable: true,
    unique: true,
  })
  username?: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    nullable: true,
    unique: false,
  })
  password?: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.Inactive,
  })
  status: UserStatus;

  @Exclude({ toPlainOnly: true })
  @Column({
    nullable: false,
    default: Role.USER,
  })
  role?: Role;

  @Exclude({ toPlainOnly: true })
  @Column({
    nullable: true,
    default: null,
  })
  token?: string;

  @Column({
    nullable: false,
    type: 'bool',
    default: false,
  })
  isRegistered?: boolean;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => Admin, (admin) => admin.users, { onDelete: 'CASCADE' })
  admin: Admin;

  @OneToMany(() => Task, (tasks) => tasks.project)
  tasks: Task[];

  @Exclude({ toPlainOnly: true })
  @ManyToMany(() => Project, (project) => project.id, { cascade: true })
  @JoinTable({
    name: 'users_projects',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'projectId', referencedColumnName: 'id' },
  })
  projects: Project[];

  // @OneToOne(() => Auth, { cascade: true })
  // @JoinColumn()
  // @Exclude({ toPlainOnly: true })
  // auth: Auth;
}
