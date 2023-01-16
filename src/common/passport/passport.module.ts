import { Module } from '@nestjs/common';
import { PassportModule as PassportModuleNest } from '@nestjs/passport';

export const PassportModuleCommon = PassportModuleNest.register({ defaultStrategy: 'jwt' });

@Module({
  imports: [PassportModuleCommon],
  exports: [PassportModuleCommon],
})
export class PassportModule {}
