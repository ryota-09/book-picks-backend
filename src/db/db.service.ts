import { Injectable } from '@nestjs/common';
import { Book, PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

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
    const salt = await bcrypt.genSalt();
    const newUser = await prisma.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, salt),
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

  async getUserByEmail(email: string) {
    const userList = await prisma.user.findMany();
    let targetUser: User;
    for (const user of userList) {
      if (user.email === email) {
        targetUser = user;
      }
    }
    return targetUser;
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

  async getBookCollectionByUserId(
    userId: number,
  ): Promise<ReturnCollectionType> {
    const originCollection = await prisma.bookCollection.findUnique({
      where: {
        authorId: Number(userId),
      },
    });
    const originUser = await prisma.user.findUnique({
      where: {
        userId: Number(userId),
      },
    });

    const originBooks = await prisma.book.findMany();
    const targetBookList: Book[] = [];

    for (const book of originBooks) {
      if (book.connectId === originCollection.collectionId) {
        targetBookList.push(book);
      }
    }
    await prisma.$disconnect();
    return {
      collectionId: originCollection.collectionId,
      author: originUser,
      bookList: targetBookList,
      likeCount: originCollection.likeCount,
    };
  }
}
