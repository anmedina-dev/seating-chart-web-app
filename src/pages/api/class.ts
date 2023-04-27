import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
  } else if (req.method === "POST") {
    return createClass(req, res);
  }
}

async function createClass(req: NextApiRequest, res: NextApiResponse<any>) {
  const body = req.body;

  try {
  } catch (error) {
    return res.status(400).json(error);
  }
}
