import prisma from "@/lib/prisma";
import { error } from "console";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const subjects = await prisma.subjects.findMany({});
    res.setHeader("Cache-Control", "s-maxage=86400");
    return res.status(200).json(subjects);
  } else if (req.method === "POST") {
    return await createSubject(req, res);
  }
}

async function createSubject(req: NextApiRequest, res: NextApiResponse<any>) {
  const body = req.body;

  try {
    const newSubject = await prisma.subjects.create({
      data: {
        name: body.name,
      },
    });
    return res.status(200).json(newSubject);
  } catch {
    return res.status(400).json(error);
  }
}
