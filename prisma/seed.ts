import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { name: "User1", email: "user1@test.com" },
      { name: "User2", email: "user2@test.com" },
      { name: "User3", email: "user3@test.com" },
      { name: "User4", email: "user4@test.com" },
      { name: "User5", email: "user5@test.com" },
      { name: "User6", email: "user6@test.com" },
      { name: "User7", email: "user7@test.com" },
      { name: "User8", email: "user8@test.com" },
      { name: "User9", email: "user9@test.com" },
      { name: "User10", email: "user10@test.com" },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });