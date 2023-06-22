import prisma from "@/lib/prisma";
import { error } from "console";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { query } = req;
  const classroom_id_string = query.classroom_id as string;
  const classroom_id = +classroom_id_string;

  if (req.method === "GET") {
    const classrooms = await prisma.tables.findMany({
      where: {
        classroom_id: classroom_id,
      },
    });
    return res.status(200).json(classrooms);
  } else if (req.method === "POST") {
    const body = req.body;
    if (body.function === "add") return await createTable(req, res);
    if (body.function === "delete") return await deleteTable(req, res);
    if (body.function === "update") return await updateTable(req, res);
    return res.status(400).json({ error: "Invalid table method" });
  }
}

async function createTable(req: NextApiRequest, res: NextApiResponse<any>) {
  const body = req.body;

  try {
    const newTable = await prisma.tables.create({
      data: {
        seats: body.seats,
        classroom_id: body.classroom_id,
      },
    });
    return res.status(200).json(newTable);
  } catch {
    return res.status(400).json(error);
  }
}

async function deleteTable(req: NextApiRequest, res: NextApiResponse<any>) {
  const body = req.body;
  const table_id_string = body.id;
  const table_id = +table_id_string;

  try {
    const oldTable = await prisma.tables.delete({
      where: {
        id: table_id,
      },
    });
    return res.status(200).json(oldTable);
  } catch {
    return res.status(400).json(error);
  }
}

async function updateTable(req: NextApiRequest, res: NextApiResponse<any>) {
  const body = req.body;
  const table_id_string = body.id;
  const table_id = +table_id_string;

  body.id;
  try {
    if (body.seat_function === "add") {
      const oldTable = await prisma.tables.update({
        where: {
          id: table_id,
        },
        data: {
          seats: {
            increment: 1,
          },
        },
      });
      return res.status(200).json(oldTable);
    }
    if (body.seat_function === "delete") {
      const oldTable = await prisma.tables.update({
        where: {
          id: table_id,
        },
        data: {
          seats: {
            decrement: 1,
          },
        },
      });
      return res.status(200).json(oldTable);
    }
    return res.status(400).json({ error: "invalid seat function" });
  } catch {
    return res.status(400).json(error);
  }
}
