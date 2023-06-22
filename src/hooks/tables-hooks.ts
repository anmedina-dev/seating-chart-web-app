import { ClassroomTable } from "@/interfaces";
import axios from "axios";
import { useState } from "react";

const useTablesHook = () => {
  const [tables, setTables] = useState<ClassroomTable[]>();

  const getTables = async (classroom: { id: any }) => {
    if (!classroom) return;
    const response = await axios.get("/api/tables", {
      params: { classroom_id: classroom.id },
    });

    const responseData = await response.data;

    setTables(responseData);
  };

  const addTable = async (classroom: { id: any }) => {
    if (!classroom) return;
    const response = await axios.post("/api/tables", {
      seats: 1,
      classroom_id: classroom.id,
      function: "add",
    });

    const responseData = await response.data;

    await getTables(classroom);
  };

  const deleteTable = async (room_id: number, classroom: { id: any }) => {
    if (!classroom) return;
    const response = await axios.post("/api/tables", {
      id: room_id,
      function: "delete",
    });

    const responseData = await response.data;

    await getTables(classroom);
  };

  const addTableSeats = async (room_id: number, classroom: { id: any }) => {
    if (!classroom) return;
    const response = await axios.post("/api/tables", {
      id: room_id,
      function: "update",
      seat_function: "add",
    });

    const responseData = await response.data;

    await getTables(classroom);
  };

  const deleteTableSeats = async (room_id: number, classroom: { id: any }) => {
    if (!classroom) return;
    if (!tables) return;

    const tempTable = tables.find((item) => item.id === +room_id);
    if (tempTable && tempTable.seats === 1) {
      await deleteTable(tempTable.id, classroom);
      return;
    }
    const response = await axios.post("/api/tables", {
      id: room_id,
      function: "update",
      seat_function: "delete",
    });

    const responseData = await response.data;

    await getTables(classroom);
  };

  return {
    tables,
    getTables,
    addTable,
    deleteTable,
    addTableSeats,
    deleteTableSeats,
  };
};

export default useTablesHook;
