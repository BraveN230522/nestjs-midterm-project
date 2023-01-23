import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHelper } from '../../helpers';
import { IPaginationResponse } from '../../interfaces';
import { assignIfHasKey } from '../../utilities';
import { Status } from '../entities/statuses.entity';
import { User } from '../entities/users.entity';
import { CreateStatusDto, UpdateStatusDto } from './dto/statuses.dto';
import { StatusesRepository } from './statuses.repository';

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(StatusesRepository) private statusesRepository: StatusesRepository, // private usersService: UsersService,
  ) {}

  async getStatuses(getStatusDto): Promise<IPaginationResponse<Status>> {
    const { page, perPage } = getStatusDto;
    return this.statusesRepository.paginationRepository(this.statusesRepository, {
      page,
      perPage,
    });
  }

  async getStatus(id): Promise<Status> {
    const found = await this.statusesRepository.findOneBy({ id });

    if (!found) ErrorHelper.NotFoundException(`Status ${id} is not found`);

    return found;
  }

  async createStatus(createStatusDto: CreateStatusDto): Promise<any> {
    try {
      const { name, order, isShow } = createStatusDto;
      console.log({ order });
      const status = this.statusesRepository.create({
        name,
        order,
        isShow,
      });
      await this.statusesRepository.save([status]);
      return status;
    } catch (error) {
      if (error.code === '23505') {
        const detail = error.detail as string;
        const uniqueArr = ['name', 'order'];

        uniqueArr.forEach((item) => {
          if (detail.indexOf(item) !== -1)
            ErrorHelper.ConflictException(`This ${item} already exists`);
        });
      } else ErrorHelper.InternalServerErrorException();
    }
  }

  async deleteStatus(id): Promise<void> {
    const result = await this.statusesRepository.delete(id);
    if (result.affected === 0) ErrorHelper.NotFoundException(`Status ${id} is not found`);
  }

  async updateStatus(id, updateStatusDto: UpdateStatusDto): Promise<Status> {
    const status = await this.getStatus(id);
    assignIfHasKey(status, updateStatusDto);

    await this.statusesRepository.save([status]);

    return status;
  }

  async getUserStatuses(id, getUserStatusesDto): Promise<IPaginationResponse<Status>> {
    const queryBuilderRepo = await this.statusesRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.user', 'u')
      .where('t.userId = :id', { id: id })
      .select(['t', 'u.id', 'u.name']);

    return await this.statusesRepository.paginationQueryBuilder(
      queryBuilderRepo,
      getUserStatusesDto,
      true,
    );
  }
}
