import { Exclude } from 'class-transformer';
import { IsDate } from 'class-validator';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTable } from '../../base';
import { Role } from '../../enums';
import { User } from '../users/users.entity';

@Entity()
export class Admin extends BaseTable {
  constructor(partial: Partial<Admin>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    nullable: false,
    unique: true,
  })
  username: string;

  @Column()
  password?: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    nullable: false,
    default: Role.ADMIN,
  })
  role?: Role;

  @Column({
    nullable: true,
    default: null,
  })
  token?: string;

  @OneToMany(() => User, (user) => user.admin)
  users: User[];
}
