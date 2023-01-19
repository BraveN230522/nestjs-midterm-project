import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { EventEmitter } from 'events';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  ObjectID,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IPageOption, IPaginationResponse } from '../interfaces';
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

  async find(conditions, options?: FindManyOptions<Model>): Promise<Model[]> {
    return instanceToPlain(await this.repo.find({ where: conditions, ...options })) as Model[];
  }

  async findRaw(conditions, options?: FindOneOptions<Model>): Promise<Model[]> {
    return await this.repo.find({ where: conditions, ...options });
  }

  async findOneBy(opts?: FindOptionsWhere<Model> | FindOptionsWhere<Model>[]): Promise<Model> {
    return instanceToPlain(await this.repo.findOneBy(opts)) as Model;
  }

  async findOneByRaw(opts?: FindOptionsWhere<Model> | FindOptionsWhere<Model>[]): Promise<Model> {
    return await this.repo.findOneBy(opts);
  }

  async findOne(options: FindOneOptions<Model>): Promise<Model> {
    return (await instanceToPlain(this.repo.findOne(options))) as Model;
  }

  async findOneRaw(conditions, options?: FindOneOptions<Model>): Promise<Model> {
    return await this.repo.findOne({ where: conditions, ...options });
  }

  async findByIds(ids: any[]): Promise<Model[]> {
    return instanceToPlain(
      await this.repo.findBy({ id: In(ids) } as FindOptionsWhere<Model>),
    ) as Model[];
  }

  async findByIdsRaw(ids: any[]): Promise<Model[]> {
    return await this.repo.findBy({ id: In(ids) } as FindOptionsWhere<Model>);
  }

  async findAndCount(options?: FindManyOptions<Model>): Promise<[Model[], number]> {
    const [items, count] = await this.repo.findAndCount(options);
    return [instanceToPlain(items) as Model[], count];
  }

  async findAndCountRaw(options?: FindManyOptions<Model>): Promise<[Model[], number]> {
    const [items, count] = await this.repo.findAndCount(options);
    return [items, count];
  }

  async save(entity: Model[]): Promise<Model[]> {
    return instanceToPlain(await this.repo.save(entity)) as Model[];
  }
  async update(id: number, entity: QueryDeepPartialEntity<Model>): Promise<UpdateResult> {
    return instanceToPlain(await this.repo.update(id, entity)) as UpdateResult;
  }

  async delete(
    criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindOptionsWhere<Model>,
  ): Promise<DeleteResult> {
    return this.repo.delete(criteria);
  }

  async softDelete(entity): Promise<UpdateResult> {
    return this.repo.softDelete(entity);
  }

  async paginationRepository(
    repository: Repository<Model>,
    pageOption: IPageOption,
    options?: FindManyOptions<Model>,
    isRaw?: boolean,
  ): Promise<IPaginationResponse<Model>> {
    const { page, perPage } = numberInputs(pageOption);
    const [result, total] = await repository.findAndCount({
      take: perPage || 10,
      skip: (page - 1) * perPage || 0,
      ...options,
    });
    return {
      items: isRaw ? result : instanceToPlain(result),
      pagination: genPagination(page, perPage, total),
    };
  }

  async paginationQueryBuilder(
    queryBuilder: SelectQueryBuilder<Model>,
    pageOptions: IPageOption,
    isRaw?: boolean,
  ): Promise<IPaginationResponse<Model>> {
    const { perPage, page } = numberInputs(pageOptions);
    const total = await queryBuilder.getCount();
    const result = await queryBuilder
      .skip(perPage * (page - 1))
      .take(perPage)
      .getMany();

    return {
      items: isRaw ? result : instanceToPlain(result),
      pagination: genPagination(page, perPage, total),
    };
  }

  getRepo(): Repository<Model> {
    return this.repo;
  }
}
