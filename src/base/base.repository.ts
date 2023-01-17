import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { EventEmitter } from 'events';
import { IPaginationMeta, IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IPageOption } from '../interfaces';
import { genPagination, numberInputs } from '../utilities';
import { BaseTable } from './base.entity';

export class BaseRepository<Model extends BaseTable> extends Repository<Model> {
  constructor(protected readonly repo: Repository<Model>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  // async create(entity: DeepPartial<Model>): Promise<Model> {
  //   return instanceToPlain(await this.repo.save(entity)) as Model;
  // }

  async createMultipleEntities(entities?: DeepPartial<Model>[]): Promise<Array<Model>> {
    return instanceToPlain(await this.repo.save(entities)) as Array<Model>;
  }

  async findOneBy(opts?: FindOptionsWhere<Model> | FindOptionsWhere<Model>[]): Promise<Model> {
    return instanceToPlain(await this.repo.findOneBy(opts)) as Model;
  }

  async findOne(options: FindOneOptions<Model>): Promise<Model> {
    return (await instanceToPlain(this.repo.findOne(options))) as Model;
  }

  async findRaw(conditions, options?: FindOneOptions<Model>): Promise<Model[]> {
    return this.repo.find({ where: conditions, ...options });
  }

  async findOneRaw(conditions, options?: FindOneOptions<Model>): Promise<Model> {
    return this.repo.findOne({ where: conditions, ...options });
  }

  async findByIds(ids: any[]): Promise<Model[]> {
    return instanceToPlain(
      await this.repo.findBy({ id: In(ids) } as FindOptionsWhere<Model>),
    ) as Model[];
  }
  // use findBy method instead in conjunction with In operator, for example:

  // .findBy({ id: In([1, 2, 3]) })

  async findAndCount(options?: FindManyOptions<Model>): Promise<[Model[], number]> {
    const [items, count] = await this.repo.findAndCount(options);
    return [instanceToPlain(items) as Model[], count];
  }

  async find(conditions, options?: FindManyOptions<Model>): Promise<Model[]> {
    return instanceToPlain(await this.repo.find({ where: conditions, ...options })) as Model[];
  }

  async save(entity: Model[]): Promise<Model[]> {
    return instanceToPlain(await this.repo.save(entity)) as Model[];
  }
  async update(id: number, entity: QueryDeepPartialEntity<Model>): Promise<UpdateResult> {
    return instanceToPlain(await this.repo.update(id, entity)) as UpdateResult;
  }

  async delete(
    criteria: string | string[] | number | number[] | Date | Date[],
  ): Promise<DeleteResult> {
    return this.repo.delete(criteria);
  }

  async softDelete(entity): Promise<UpdateResult> {
    return this.repo.softDelete(entity);
  }

  async paginationRepository(
    repository: Repository<Model>,
    pageOption: IPageOption,
    options?: FindOneOptions<Model>,
  ): Promise<any> {
    const { page, perPage } = numberInputs(pageOption);
    const [result, total] = await repository.findAndCount({
      take: perPage || 10,
      skip: (page - 1) * perPage || 0,
      ...options,
    });
    return {
      items: instanceToPlain(result),
      pagination: genPagination(page, perPage, total),
    };
  }

  async paginationQueryBuilder(
    queryBuilder: SelectQueryBuilder<Model>,
    options: IPaginationOptions,
  ): Promise<Pagination<Model, IPaginationMeta>> {
    const pgResult = await paginate(queryBuilder, options);
    return {
      ...pgResult,
      items: instanceToPlain(pgResult.items) as any,
    };
  }

  getModel(): Repository<Model> {
    return this.repo;
  }
}
