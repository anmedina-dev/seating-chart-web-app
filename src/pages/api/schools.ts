import prisma from "@/lib/prisma";
import { error } from "console";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const teachers = await prisma.schools.findMany({ select: { name: true } });
    return res.status(200).json(teachers);
  } else if (req.method === "POST") {
    return await createSchool(req, res);
  }
}

async function createSchool(req: NextApiRequest, res: NextApiResponse<any>) {
  const body = req.body;

  try {
    const newSchool = await prisma.schools.create({
      data: {
        name: body.school,
      },
    });
    return res.status(200).json(newSchool);
  } catch {
    return res.status(400).json(error);
  }
}
