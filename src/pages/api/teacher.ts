// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@/lib/prisma";
import { error } from "console";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const teachers = await prisma.teachers.findMany();
    return res.status(200).json(teachers);
  } else if (req.method === "POST") {
    return await createTeacher(req, res);
  }
}

async function createTeacher(req: NextApiRequest, res: NextApiResponse<any>) {
  const body = req.body;

  let schoolId = await prisma.schools.findUnique({
    where: {
      name: body.school,
    },
  });

  if (!schoolId)
    schoolId = await prisma.schools.create({ data: { name: body.school } });

  try {
    const newTeacher = await prisma.teachers.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        school_id: schoolId["id"],
      },
    });
    return res.status(200).json(newTeacher);
  } catch {
    return res.status(400).json(error);
  }
}
