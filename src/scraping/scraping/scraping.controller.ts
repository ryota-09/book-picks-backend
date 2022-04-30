import { Body, Controller, Post } from '@nestjs/common';
import { SearchTextDto } from '../dto/search-text.dto';
import { ScrapingService } from './scraping.service';

@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingSearvice: ScrapingService) {}
  @Post()
  searchBooks(@Body() searchText: SearchTextDto) {
    return this.scrapingSearvice.scrapingBooks(searchText);
  }
}
