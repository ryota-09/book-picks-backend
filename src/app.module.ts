import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapingModule } from './scraping/scraping/scraping.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [ScrapingModule, DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
