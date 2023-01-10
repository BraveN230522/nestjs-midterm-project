import { UserStatus } from '../../../enums';

export class CreateUserDto {
  name: string;
  status: UserStatus;
}
