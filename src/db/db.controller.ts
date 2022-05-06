import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { DbService } from './db.service';
import { AddBookDto } from './dto/add-book.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('db')
export class DbController {
  constructor(private readonly dbService: DbService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.dbService.createUser(createUserDto);
  }

  @Patch('addBook')
  addBook(@Body() addBookDto: AddBookDto) {
    return this.dbService.addBook(addBookDto);
  }

  @Get()
  getAllBookCollection() {
    return this.dbService.getAllBookCollection();
  }
}
