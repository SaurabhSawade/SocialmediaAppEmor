import bcrypt from "bcrypt";
import { prisma } from "../src/prisma";

async function main() {
  console.log("Seeding database...");

  // --- Users ---
  const usersData = [
    { name: "Alice", email: "alice@example.com", phone: "+911000000001" },
    { name: "Bob", email: "bob@example.com", phone: "+911000000002" },
    { name: "Charlie", email: "charlie@example.com", phone: "+911000000003" },
    { name: "David", email: "david@example.com", phone: "+911000000004" },
    { name: "Eva", email: "eva@example.com", phone: "+911000000005" },
    { name: "Frank", email: "frank@example.com", phone: "+911000000006" },
    { name: "Grace", email: "grace@example.com", phone: "+911000000007" },
    { name: "Hannah", email: "hannah@example.com", phone: "+911000000008" },
    { name: "Ian", email: "ian@example.com", phone: "+911000000009" },
    { name: "Julia", email: "julia@example.com", phone: "+911000000010" },
  ];

  const users = [];
  for (const u of usersData) {
    const hashedPassword = await bcrypt.hash("Password123!", 10);
    const user = await prisma.users.create({
      data: {
        ...u,
        password: hashedPassword,
        is_verified: true,
      },
    });
    users.push(user);
  }

  // --- Posts ---
  const posts = [];
  for (const user of users) {
    const postCount = Math.floor(Math.random() * 3) + 1; // 1–3 posts
    for (let i = 0; i < postCount; i++) {
      const post = await prisma.posts.create({
        data: {
          content: `Post ${i + 1} by ${user.name}`,
          author_id: user.id,
        },
      });
      posts.push(post);
    }
  }

  // --- Comments ---
  const comments = [];
  for (const post of posts) {
    const commentCount = Math.floor(Math.random() * 4); // 0–3 comments
    for (let i = 0; i < commentCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const comment = await prisma.comments.create({
        data: {
          content: `Comment ${i + 1} on post ${post.id}`,
          post_id: post.id,
          user_id: user.id,
        },
      });
      comments.push(comment);

      // Optionally add a reply
      if (Math.random() > 0.5) {
        const replyUser = users[Math.floor(Math.random() * users.length)];
        const reply = await prisma.comments.create({
          data: {
            content: `Reply to comment ${comment.id}`,
            post_id: post.id,
            user_id: replyUser.id,
            parent_id: comment.id,
          },
        });
        comments.push(reply);
      }
    }
  }

  // --- Likes ---
  for (const post of posts) {
    const likeCount = Math.floor(Math.random() * users.length); // 0–users.length likes
    const shuffledUsers = users.sort(() => 0.5 - Math.random()).slice(0, likeCount);
    for (const user of shuffledUsers) {
      await prisma.likes.create({
        data: {
          post_id: post.id,
          user_id: user.id,
        },
      });
    }
  }

  // --- Messages ---
  for (let i = 0; i < 20; i++) {
    const sender = users[Math.floor(Math.random() * users.length)];
    let receiver = users[Math.floor(Math.random() * users.length)];
    while (receiver.id === sender.id) {
      receiver = users[Math.floor(Math.random() * users.length)];
    }
    await prisma.messages.create({
      data: {
        sender_id: sender.id,
        receiver_id: receiver.id,
        message: `Message ${i + 1} from ${sender.name} to ${receiver.name}`,
      },
    });
  }

  // --- OTP entries (optional) ---
  for (const user of users.slice(0, 5)) {
    await prisma.otp_verifications.create({
      data: {
        phone: user.phone!,
        otp: "123456",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        verified: true,
        test: true,
      },
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());