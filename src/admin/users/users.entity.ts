import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserStatus } from '../../enums';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    default: null,
    unique: true,
  })
  name?: string;

  @Column()
  status: UserStatus;
}
