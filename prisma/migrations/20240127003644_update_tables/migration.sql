/*
  Warnings:

  - You are about to drop the column `rolea` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "rolea",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
