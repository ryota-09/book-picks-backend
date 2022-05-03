import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DbService {
  async createUser() {
    const prisma = new PrismaClient();
    const newUser = await prisma.user.create({
      data: {
        userId: 1,
        username: '鈴木',
        avatatar: 'img',
        remarks: 'こんちは',
        userBookCollection: {
          create: {
            collectionId: 1,
            bookIdList: [],
            likeCount: 0,
          },
        },
      },
    });
    console.log(newUser);
    await prisma.$disconnect();
  }
}
