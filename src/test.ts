import { prisma } from "./prisma";

async function main() {
  const posts = await prisma.posts.findMany();
  console.log(posts);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());