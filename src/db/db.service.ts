import { Injectable } from '@nestjs/common';
import { Book, PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { AddBookDto } from './dto/add-book.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteBookDto } from './dto/delete-book.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

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

  async updateUser(updateUserDto: UpdateUserDto) {
    const updatedUser = await prisma.user.update({
      where: {
        userId: Number(updateUserDto.userId),
      },
      data: {
        avatatar: updateUserDto.avatatar,
        remarks: updateUserDto.remarks,
      },
    });
    return {
      userId: updatedUser.userId,
      username: updatedUser.username,
      email: '',
      password: '',
      avatatar: updatedUser.avatatar,
      remarks: updatedUser.remarks,
    };
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

  async deleteBook(deleteBookDto: DeleteBookDto) {
    await prisma.book.delete({
      where: { bookId: Number(deleteBookDto.bookId) },
    });
    await prisma.$disconnect();
    return 'DELETE成功!';
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

  async countUpStars(updateCollectionDto: UpdateCollectionDto) {
    await prisma.bookCollection.update({
      where: {
        collectionId: Number(updateCollectionDto.collectionId),
      },
      data: {
        likeCount: Number(updateCollectionDto.likeCount) + 1,
      },
    });
    return 'カウントアップ成功';
  }

  async countDownStars(updateCollectionDto: UpdateCollectionDto) {
    await prisma.bookCollection.update({
      where: {
        collectionId: Number(updateCollectionDto.collectionId),
      },
      data: {
        likeCount: Number(updateCollectionDto.likeCount) - 1,
      },
    });
    return 'カウントダウン成功';
  }
}
