import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTable } from '../../base';
import { Role, UserStatus } from '../../enums';
import { Admin } from '../admin/admin.entity';
import { Task } from '../tasks/tasks.entity';

@Entity()
export class User extends BaseTable {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Column()
  name?: string;

  @Column({
    nullable: false,
    unique: true,
  })
  username: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password?: string;

  @Column({
    nullable: false,
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

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => Admin, (admin) => admin.users, { onDelete: 'CASCADE' })
  admin: Admin;

  @OneToMany(() => Task, (tasks) => tasks.user)
  tasks: Task[];

  // @OneToOne(() => Auth, { cascade: true })
  // @JoinColumn()
  // @Exclude({ toPlainOnly: true })
  // auth: Auth;
}