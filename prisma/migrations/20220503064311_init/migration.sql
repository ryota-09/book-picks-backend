-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "avatatar" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "BookCollection" (
    "collectionId" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "bookIdList" INTEGER[],
    "likeCount" INTEGER NOT NULL,

    CONSTRAINT "BookCollection_pkey" PRIMARY KEY ("collectionId")
);

-- CreateTable
CREATE TABLE "Book" (
    "bookId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "imgPath" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "connectId" INTEGER NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("bookId")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookCollection_authorId_key" ON "BookCollection"("authorId");

-- AddForeignKey
ALTER TABLE "BookCollection" ADD CONSTRAINT "BookCollection_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_connectId_fkey" FOREIGN KEY ("connectId") REFERENCES "BookCollection"("collectionId") ON DELETE RESTRICT ON UPDATE CASCADE;
