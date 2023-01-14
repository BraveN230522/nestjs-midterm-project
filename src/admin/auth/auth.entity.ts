import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Exclude } from 'class-transformer';
import { Role } from '../../enums';

@Entity()
export class Auth {
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

  // @OneToOne(() => User, (user) => user.auth) // specify inverse side as a second parameter
  // @JoinColumn()
  // user: User;

  // @OneToOne(() => User, (user) => user.id)
  // @JoinColumn()
  // user: User;
}
