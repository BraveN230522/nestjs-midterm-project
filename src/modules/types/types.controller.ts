import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleDecorator, RolesGuard, UserDecorator } from '../../common';
import { Role } from '../../enums';
import { Type } from '../entities/types.entity';
import { User } from '../entities/users.entity';
import { CreateTypeDto, GetTypeDto, UpdateTypeDto } from './dto/types.dto';
import { TypesService } from './types.service';

@Controller('Types')
@UseGuards(AuthGuard(), RolesGuard)
export class TypesController {
  constructor(private TypesService: TypesService) {}

  @Get()
  getTypes(@Body() getTypeDto: GetTypeDto) {
    return this.TypesService.getTypes(getTypeDto);
  }

  @Post()
  @RoleDecorator(Role.USER)
  createType(@Body() createTypeDto: CreateTypeDto, @UserDecorator() user: User): Promise<Type> {
    return this.TypesService.createType(createTypeDto, user);
  }

  @Patch('/:id')
  // @RoleDecorator(Role.ADMIN)
  updateProject(@Param('id') id, @Body() updateTypeDto: UpdateTypeDto): Promise<Type> {
    return this.TypesService.updateType(id, updateTypeDto);
  }

  // @Delete('/:id')
  // deleteType(@Param('id') id): Promise<void> {
  //   return this.TypesService.deleteType(id);
  // }

  // @Patch('/:id')
  // updateType(
  //   @Param('id') id,
  //   @Body() updateTypeDto: CreateTypeDto,
  // ): Promise<Type> {
  //   return this.TypesService.updateType(id, updateTypeDto);
  // }
}
