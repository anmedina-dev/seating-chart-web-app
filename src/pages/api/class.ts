import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { query } = req;
  const teacher_id_string = query.teacher_id as string;
  const teacher_id = +teacher_id_string;
  if (req.method === "GET") {
    const classes = await prisma.classes.findMany({
      where: {
        teacher_id: teacher_id,
      },
    });
    res.setHeader("Cache-Control", "s-maxage=86400");
    return res.status(200).json(classes);
  } else if (req.method === "POST") {
    if (req.body.function === "add") return createClass(req, res);
    if (req.body.function === "delete") return deleteClass(req, res);
    return res.status(400).json({ error: "Not a valid function" });
  }
}

async function createClass(req: NextApiRequest, res: NextApiResponse<any>) {
  const body = req.body;

  const subjectId = await prisma.subjects.findMany({
    where: {
      name: body.subject,
    },
  });

  if (subjectId.length < 1)
    return res.status(400).json({ error: "Subject doesn't exists" });

  const doesClassExist = await prisma.classes.findMany({
    where: {
      period: body.period,
      subject_id: subjectId[0]["id"],
      classroom_id: body.classroom_id,
      teacher_id: body.teacher_id,
    },
  });

  if (doesClassExist.length > 0)
    return res.status(400).json({ error: "Class exists" });

  try {
    const newClass = await prisma.classes.create({
      data: {
        period: body.period,
        subject_id: subjectId[0]["id"],
        classroom_id: body.classroom_id,
        teacher_id: body.teacher_id,
      },
    });
    return res.status(200).json(newClass);
  } catch (error) {
    return res.status(400).json(error);
  }
}

async function deleteClass(req: NextApiRequest, res: NextApiResponse<any>) {
  const body = req.body;

  try {
    const deletedClass = await prisma.classes.deleteMany({
      where: {
        period: body.period,
        teacher_id: body.teacher_id,
      },
    });
    return res.status(200).json(deletedClass);
  } catch (error) {
    return res.status(400).json(error);
  }
}
