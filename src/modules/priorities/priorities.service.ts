import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHelper } from '../../helpers';
import { IPaginationResponse } from '../../interfaces';
import { assignIfHasKey } from '../../utilities';
import { Priority } from '../entities/priorities.entity';
import { User } from '../entities/users.entity';
import { CreatePriorityDto } from './dto/priorities.dto';
import { PrioritiesRepository } from './priorities.repository';

@Injectable()
export class PrioritiesService {
  constructor(
    @InjectRepository(PrioritiesRepository) private prioritiesRepository: PrioritiesRepository, // private usersService: UsersService,
  ) {}

  async getPriorities(getPriorityDto): Promise<IPaginationResponse<Priority>> {
    const { page, perPage } = getPriorityDto;
    return this.prioritiesRepository.paginationRepository(this.prioritiesRepository, {
      page,
      perPage,
    });
  }

  async getPriority(id): Promise<Priority> {
    const found = await this.prioritiesRepository.findOneBy({ id });

    if (!found) ErrorHelper.NotFoundException(`Priority ${id} is not found`);

    return found;
  }

  async createPriority(createPriorityDto: CreatePriorityDto, currentUser: User): Promise<any> {
    // try {
    //   const { name, userId, startDate, endDate } = createPriorityDto;
    //   const [formattedStartDate, formattedEndDate] = datesToISOString([startDate, endDate]);
    //   const user = await this.usersService.getUser(userId);
    //   const priority = this.prioritiesRepository.create({
    //     name,
    //     startDate: formattedStartDate,
    //     endDate: formattedEndDate,
    //     user: user || currentUser,
    //   });
    //   await this.prioritiesRepository.save([priority]);
    //   const mappingPriority = _.omit(priority, ['user']) as Priority;
    //   return mappingPriority;
    // } catch (error) {
    //   console.log({ error });
    //   if (error.code === '23505') ErrorHelper.ConflictException('This name already exists');
    //   else ErrorHelper.InternalServerErrorException();
    // }
  }

  async deletePriority(id): Promise<void> {
    const result = await this.prioritiesRepository.delete(id);
    if (result.affected === 0) ErrorHelper.NotFoundException(`Priority ${id} is not found`);
  }

  async updatePriority(id, updatePriorityDto): Promise<Priority> {
    const priority = await this.getPriority(id);
    assignIfHasKey(priority, updatePriorityDto);

    await this.prioritiesRepository.save([priority]);

    return priority;
  }

  async getUserPriorities(id, getUserPrioritiesDto): Promise<IPaginationResponse<Priority>> {
    const queryBuilderRepo = await this.prioritiesRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.user', 'u')
      .where('t.userId = :id', { id: id })
      .select(['t', 'u.id', 'u.name']);

    return await this.prioritiesRepository.paginationQueryBuilder(
      queryBuilderRepo,
      getUserPrioritiesDto,
      true,
    );
  }
}
