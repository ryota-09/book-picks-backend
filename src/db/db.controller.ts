import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DbService } from './db.service';
import { AddBookDto } from './dto/add-book.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteBookDto } from './dto/delete-book.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('db')
export class DbController {
  constructor(private readonly dbService: DbService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.dbService.createUser(createUserDto);
  }

  @Patch('update')
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.dbService.updateUser(updateUserDto);
  }

  @Patch('addBook')
  addBook(@Body() addBookDto: AddBookDto) {
    return this.dbService.addBook(addBookDto);
  }

  @Patch('likeCount/up')
  countLikeUp(@Body() updateCollectionDto: UpdateCollectionDto) {
    return this.dbService.countUpStars(updateCollectionDto);
  }

  @Patch('likeCount/down')
  countLikeDown(@Body() updateCollectionDto: UpdateCollectionDto) {
    return this.dbService.countDownStars(updateCollectionDto);
  }

  @Get()
  getAllBookCollection() {
    return this.dbService.getAllBookCollection();
  }

  @Get(':userId')
  getBookCollectionByUserId(@Param('userId') userId: number) {
    return this.dbService.getBookCollectionByUserId(userId);
  }

  @Delete('delete')
  deleteBook(@Body() deleteBookDto: DeleteBookDto) {
    return this.dbService.deleteBook(deleteBookDto);
  }
}
