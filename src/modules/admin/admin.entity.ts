import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../enums';
import { User } from '../users/users.entity';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  username: string;

  @Column()
  password?: string;

  @Column({
    nullable: false,
    default: Role.ADMIN,
  })
  role: Role;

  @Column({
    nullable: true,
    default: null,
  })
  token?: string;

  @OneToMany(() => User, (user) => user.admin)
  users: User[];
}
