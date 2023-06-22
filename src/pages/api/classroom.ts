import prisma from "@/lib/prisma";
import { error } from "console";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { query } = req;
  const school_id_string = query.school_id as string;
  const school_id = +school_id_string;

  if (req.method === "GET") {
    const classrooms = await prisma.classroom.findMany({
      where: {
        school_id: school_id,
      },
    });

    return res.status(200).json(classrooms);
  } else if (req.method === "POST") {
    return await createClassroom(req, res);
  }
}

async function createClassroom(req: NextApiRequest, res: NextApiResponse<any>) {
  const body = req.body;

  const doesRoomExist = await prisma.classroom.findMany({
    where: {
      room_number: body.room_number,
      school_id: body.school_id,
    },
  });

  if (doesRoomExist.length > 0)
    return res.status(400).json({ error: "Room Exists" });
  try {
    const newClassroom = await prisma.classroom.create({
      data: {
        room_number: body.room_number,
        school_id: body.school_id,
      },
    });
    return res.status(200).json(newClassroom);
  } catch {
    return res.status(400).json(error);
  }
}
