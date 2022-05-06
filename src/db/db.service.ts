import { Injectable } from '@nestjs/common';
import { Book, BookCollection, PrismaClient, User } from '@prisma/client';
import { AddBookDto } from './dto/add-book.dto';
import { CreateUserDto } from './dto/create-user.dto';

export type ReturnCollectionType = {
  collectionId: number;
  author: User;
  bookList: Book[];
  likeCount: number;
};

const prisma = new PrismaClient({
  log: ['query'],
});

@Injectable()
export class DbService {
  async createUser(createUserDto: CreateUserDto) {
    const newUser = await prisma.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
        avatatar: '',
        remarks: '',
        userBookCollection: {
          create: {
            likeCount: 0,
          },
        },
      },
    });
    await prisma.$disconnect();
    return newUser;
  }

  async addBook(addBookDto: AddBookDto) {
    const newBook = await prisma.book.create({
      data: {
        title: addBookDto.title,
        link: addBookDto.link,
        imgPath: addBookDto.imgPath,
        sourceUrl: addBookDto.sourceUrl,
        connectCollection: {
          connect: {
            authorId: Number(addBookDto.userId),
          },
        },
      },
    });
    await prisma.$disconnect();
    return newBook;
  }

  async getAllBookCollection() {
    const allBookCollection: ReturnCollectionType[] = [];

    const originCollections = await prisma.bookCollection.findMany();
    const originBooks = await prisma.book.findMany();
    const originUsers = await prisma.user.findMany();

    for (const collection of originCollections) {
      const currentBookList: Book[] = [];
      for (const user of originUsers) {
        if (collection.authorId === user.userId) {
          for (const book of originBooks) {
            if (collection.collectionId === book.connectId) {
              currentBookList.push(book);
            }
          }
          allBookCollection.push({
            collectionId: collection.collectionId,
            author: user,
            bookList: currentBookList,
            likeCount: collection.likeCount,
          });
        }
      }
    }

    await prisma.$disconnect();
    return allBookCollection;
  }
}
