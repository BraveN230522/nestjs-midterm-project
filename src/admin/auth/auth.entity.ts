import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password?: string;

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
