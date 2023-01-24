import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHelper } from '../../helpers';
import { IPaginationResponse } from '../../interfaces';
import { assignIfHasKey, matchWord } from '../../utilities';
import { Type } from '../entities/types.entity';
import { User } from '../entities/users.entity';
import { CreateTypeDto, UpdateTypeDto } from './dto/types.dto';
import { TypesRepository } from './types.repository';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(TypesRepository) private typesRepository: TypesRepository, // private usersService: UsersService,
  ) {}

  async getTypes(): Promise<Type[]> {
    return this.typesRepository.find();
  }

  async getType(id): Promise<Type> {
    const found = await this.typesRepository.findOneBy({ id });

    if (!found) ErrorHelper.NotFoundException(`Type ${id} is not found`);

    return found;
  }

  async createType(createTypeDto: CreateTypeDto): Promise<any> {
    try {
      const { name, color, isShow } = createTypeDto;
      const type = this.typesRepository.create({
        name,
        color,
        isShow,
      });
      await this.typesRepository.save([type]);
      return type;
    } catch (error) {
      if (error.code === '23505') {
        const detail = error.detail as string;
        const uniqueArr = ['name', 'color'];

        uniqueArr.forEach((item) => {
          if (matchWord(detail, item) !== null)
            ErrorHelper.ConflictException(`This ${item} already exists`);
        });
      } else ErrorHelper.InternalServerErrorException();
    }
  }

  async deleteType(id): Promise<void> {
    const result = await this.typesRepository.delete(id);
    if (result.affected === 0) ErrorHelper.NotFoundException(`Type ${id} is not found`);
  }

  async updateType(id, updateTypeDto: UpdateTypeDto): Promise<Type> {
    const type = await this.getType(id);
    assignIfHasKey(type, updateTypeDto);

    await this.typesRepository.save([type]);

    return type;
  }
}
