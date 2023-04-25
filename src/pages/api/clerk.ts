import { PrismaClient } from "@prisma/client";
import { error } from "console";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { query, method } = req;
  const clerk_id = query.id as string;

  console.log(clerk_id);

  if (method === "GET") {
    const clerk_teacher = await prisma.clerk_teacher.findUnique({
      where: {
        clerk_id: clerk_id,
      },
    });

    if (!clerk_teacher)
      return res.status(400).json({ error: "Teacher not found" });

    console.log(clerk_teacher);
    const teacher = await prisma.teachers.findUnique({
      where: {
        id: clerk_teacher["teacher_id"],
      },
    });
    console.log(teacher);
    return res.status(200).json({ teacher });
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

    const clerkTeacher = await prisma.clerk_teacher.create({
      data: {
        clerk_id: body.clerk_id,
        teacher_id: newTeacher["id"],
      },
    });
    return res.status(200).json(clerkTeacher);
  } catch {
    return res.status(400).json(error);
  }
}
