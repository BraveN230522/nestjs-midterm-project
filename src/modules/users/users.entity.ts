import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role, UserStatus } from '../../enums';
import { Admin } from '../admin/admin.entity';
import { Task } from '../tasks/tasks.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name?: string;

  @Column({
    nullable: false,
    unique: true,
  })
  username: string;

  @Column()
  password?: string;

  @Column({
    nullable: false,
    default: UserStatus.Inactive,
  })
  status: UserStatus;

  @Column({
    nullable: false,
    default: Role.USER,
  })
  role: Role;

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
