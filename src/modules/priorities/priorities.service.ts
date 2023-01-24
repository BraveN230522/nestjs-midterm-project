import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHelper } from '../../helpers';
import { IPaginationResponse } from '../../interfaces';
import { assignIfHasKey, matchWord } from '../../utilities';
import { Priority } from '../entities/priorities.entity';
import { User } from '../entities/users.entity';
import { CreatePriorityDto, UpdatePriorityDto } from './dto/priorities.dto';
import { PrioritiesRepository } from './priorities.repository';

@Injectable()
export class PrioritiesService {
  constructor(
    @InjectRepository(PrioritiesRepository) private prioritiesRepository: PrioritiesRepository, // private usersService: UsersService,
  ) {}

  async getPriorities(): Promise<Priority[]> {
    return this.prioritiesRepository.find();
  }

  async getPriority(id): Promise<Priority> {
    const found = await this.prioritiesRepository.findOneBy({ id });

    if (!found) ErrorHelper.NotFoundException(`Priority ${id} is not found`);

    return found;
  }

  async createPriority(createPriorityDto: CreatePriorityDto): Promise<any> {
    try {
      const { name, order, isShow } = createPriorityDto;
      const priority = this.prioritiesRepository.create({
        name,
        order,
        isShow,
      });
      await this.prioritiesRepository.save([priority]);
      return priority;
    } catch (error) {
      if (error.code === '23505') {
        const detail = error.detail as string;
        const uniqueArr = ['name', 'order'];

        uniqueArr.forEach((item) => {
          if (matchWord(detail, item) !== null)
            ErrorHelper.ConflictException(`This ${item} already exists`);
        });
      } else ErrorHelper.InternalServerErrorException();
    }
  }

  async deletePriority(id): Promise<void> {
    const result = await this.prioritiesRepository.delete(id);
    if (result.affected === 0) ErrorHelper.NotFoundException(`Priority ${id} is not found`);
  }

  async updatePriority(id, updatePriorityDto: UpdatePriorityDto): Promise<Priority> {
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
