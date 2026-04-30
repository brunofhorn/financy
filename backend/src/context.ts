import type { Request, Response } from "express";

import { getUserIdFromAuthHeader } from "./lib/auth.js";
import { prisma } from "./lib/prisma.js";

export type GraphQLContext = {
  req: Request;
  res: Response;
  prisma: typeof prisma;
  userId: string | null;
};

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<GraphQLContext> {
  const userId = getUserIdFromAuthHeader(req.headers.authorization);

  return {
    req,
    res,
    prisma,
    userId,
  };
}
