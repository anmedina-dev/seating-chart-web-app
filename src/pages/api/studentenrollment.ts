// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@/lib/prisma";
import { error } from "console";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const { query } = req;
    const class_id = query.id as string;
    const class_id_num = parseInt(class_id);
    const student_enrollment = await prisma.student_enrollment.findMany({
      where: {
        class_id: class_id_num,
      },
    });

    if (!student_enrollment)
      return res.status(400).json({ error: "No Students Enrolled" });

    const student_or_array: any[] = [];

    student_enrollment.forEach((x) =>
      student_or_array.push({
        id: {
          equals: x.student_id,
        },
      })
    );

    const student_array = await prisma.students.findMany({
      where: {
        OR: student_or_array,
      },
    });

    return res.status(200).json({ students: student_array });
  } else if (req.method === "POST") {
    if (req.body.method === "add")
      return await createStudentEnrollment(req, res);
    if (req.body.method === "delete")
      return await deleteStudentEnrollment(req, res);
  }
}

async function createStudentEnrollment(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const body = req.body;

  try {
    const classrooms = await prisma.tables.findMany({
      where: {
        classroom_id: body.classroom_id,
      },
    });

    let total_seats = 0;
    for (const x of classrooms) {
      total_seats = total_seats + x.seats;
    }

    const student_enrollment = await prisma.student_enrollment.findMany({
      where: {
        class_id: body.id,
      },
    });

    if (student_enrollment.length === total_seats)
      return res.status(300).json({ error: "No more available seats" });

    const student = await prisma.students.create({
      data: {
        firstName: body.firstname,
        lastName: body.lastname,
      },
    });

    const create_student_enrollment = await prisma.student_enrollment.create({
      data: {
        class_id: body.id,
        student_id: student.id,
      },
    });

    return res.status(200).json(create_student_enrollment);
  } catch {
    return res.status(400).json(error);
  }
}

async function deleteStudentEnrollment(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const body = req.body;

  try {
    const student_enrollment = await prisma.student_enrollment.deleteMany({
      where: {
        student_id: body.id,
      },
    });

    return res.status(200).json(student_enrollment);
  } catch {
    return res.status(400).json(error);
  }
}
