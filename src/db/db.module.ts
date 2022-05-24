import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { DbController } from './db.controller';

@Module({
  providers: [DbService],
  controllers: [DbController],
  exports: [DbService],
})
export class DbModule {}
