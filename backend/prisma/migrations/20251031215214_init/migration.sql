/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `detaOfBirth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "detaOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "email" VARCHAR(300) NOT NULL,
ADD COLUMN     "firstName" VARCHAR(150) NOT NULL,
ADD COLUMN     "lastLogin" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastName" VARCHAR(150) NOT NULL,
ADD COLUMN     "password" VARCHAR(150) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
