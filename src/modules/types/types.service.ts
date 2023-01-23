import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHelper } from '../../helpers';
import { IPaginationResponse } from '../../interfaces';
import { assignIfHasKey } from '../../utilities';
import { Type } from '../entities/types.entity';
import { User } from '../entities/users.entity';
import { CreateTypeDto } from './dto/types.dto';
import { TypesRepository } from './types.repository';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(TypesRepository) private typesRepository: TypesRepository, // private usersService: UsersService,
  ) {}

  async getTypes(getTypeDto): Promise<IPaginationResponse<Type>> {
    const { page, perPage } = getTypeDto;
    return this.typesRepository.paginationRepository(this.typesRepository, {
      page,
      perPage,
    });
  }

  async getType(id): Promise<Type> {
    const found = await this.typesRepository.findOneBy({ id });

    if (!found) ErrorHelper.NotFoundException(`Type ${id} is not found`);

    return found;
  }

  async createType(createTypeDto: CreateTypeDto, currentUser: User): Promise<any> {
    // try {
    //   const { name, userId, startDate, endDate } = createTypeDto;
    //   const [formattedStartDate, formattedEndDate] = datesToISOString([startDate, endDate]);
    //   const user = await this.usersService.getUser(userId);
    //   const type = this.typesRepository.create({
    //     name,
    //     startDate: formattedStartDate,
    //     endDate: formattedEndDate,
    //     user: user || currentUser,
    //   });
    //   await this.typesRepository.save([type]);
    //   const mappingType = _.omit(type, ['user']) as Type;
    //   return mappingType;
    // } catch (error) {
    //   console.log({ error });
    //   if (error.code === '23505') ErrorHelper.ConflictException('This name already exists');
    //   else ErrorHelper.InternalServerErrorException();
    // }
  }

  async deleteType(id): Promise<void> {
    const result = await this.typesRepository.delete(id);
    if (result.affected === 0) ErrorHelper.NotFoundException(`Type ${id} is not found`);
  }

  async updateType(id, updateTypeDto): Promise<Type> {
    const type = await this.getType(id);
    assignIfHasKey(type, updateTypeDto);

    await this.typesRepository.save([type]);

    return type;
  }

  async getUserTypes(id, getUserTypesDto): Promise<IPaginationResponse<Type>> {
    const queryBuilderRepo = await this.typesRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.user', 'u')
      .where('t.userId = :id', { id: id })
      .select(['t', 'u.id', 'u.name']);

    return await this.typesRepository.paginationQueryBuilder(
      queryBuilderRepo,
      getUserTypesDto,
      true,
    );
  }
}
