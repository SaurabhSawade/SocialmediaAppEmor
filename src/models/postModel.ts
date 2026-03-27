import { prisma } from "../prisma";

// Create a post
export const createPost = async (authorId: number, content: string, image?: string) => {
  if (!content) throw new Error("Content required");

  return prisma.posts.create({
    data: {
      content,
      image,
      author: {
        connect: { id: authorId }, // connect to the existing user
      },
    },
    include: {
      author: { select: { id: true, name: true } },
      comments: {
        include: { user: { select: { id: true, name: true } } }
      },
      likes: true
    },
  });
};


export const getPosts = async (
  page = 1,
  limit = 10,
  startDate: Date | null = null,
  endDate: Date | null = null
) => {
  const skip = (page - 1) * limit;

  // Build date filter if provided
  const where: any = {};
  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) where.created_at.gte = startDate;
    if (endDate) where.created_at.lte = endDate;
  }

  const posts = await prisma.posts.findMany({
    skip,
    take: limit,
    orderBy: { created_at: "desc" },
    where,
    include: {
      author: { select: { id: true, name: true } },
      comments: { include: { user: { select: { id: true, name: true } } } },
      likes: true,
    },
  });

  return posts.map((post) => ({
    id: post.id,
    content: post.content,
    image: post.image,
    created_at: post.created_at,
    updated_at: post.updated_at,
    author: post.author,
    comments: post.comments,
    likesCount: post.likes.length,
  }));
};

export const likePost = async (userId: number, postId: number) => {
  const existing = await prisma.likes.findUnique({
    where: {
      user_id_post_id: { user_id: userId, post_id: postId },
    },
  });

  if (existing) {
    await prisma.likes.delete({
      where: {
        user_id_post_id: { user_id: userId, post_id: postId },
      },
    });
    return { message: "Unliked" };
  }

  await prisma.likes.create({
    data: {
      user: { connect: { id: userId } },
      post: { connect: { id: postId } },
    },
  });

  return { message: "Liked" };
};

// Comment on a post
export const commentPost = async (userId: number, postId: number, content: string) => {
  if (!content) throw new Error("Content required");

  return prisma.comments.create({
    data: {
      content,
      user: { connect: { id: userId } },
      post: { connect: { id: postId } },
    },
    include: { user: { select: { id: true, name: true } } },
  });
};


// reply to the comment
export const replyToComment = async (
  userId: number,
  postId: number,
  parentId: number,
  content: string
) => {
  if (!content) throw new Error("Content required");

  return prisma.comments.create({
    data: {
      content,
      user: { connect: { id: userId } },
      post: { connect: { id: postId } },
      parent: { connect: { id: parentId } }, // key part
    },
    include: {
      user: { select: { id: true, name: true } },
    },
  });
};

// get who like the post
export const getPostLikes = async (postId: number) => {
  return prisma.likes.findMany({
    where: { post_id: postId },
    include: {
      user: { select: { id: true, name: true } },
    },
  });
};
