import { prisma } from "../prisma";

export const findUserByEmail = async (email: string) => {
  return prisma.users.findUnique({ where: { email } });
};

export const createUser = async (name: string, email: string, password: string) => {
  return prisma.users.create({
    data: { name, email, password },
  });
};

export const getAllUsers = async () => {
  return prisma.users.findMany({
    select: { id: true, name: true, email: true },
  });
};

export const updateRefreshToken = async (userId: number, token: string) => {
  return prisma.users.update({
    where: { id: userId },
    data: { refresh_token: token },
  });
};

export const findUserById = async (id: number) => {
  return prisma.users.findUnique({
    where: { id },
  });
};