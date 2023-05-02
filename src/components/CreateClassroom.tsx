import fetcher from "@/lib/fetch";
import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
import React, { useEffect, useState } from "react";
import styles from "../styles/CreateClassroom.module.css";
import Button from "@mui/material/Button";
import { amber } from "@mui/material/colors";
import { ClassRoom, ClassroomTable } from "@/interfaces";
import axios from "axios";
import Table from "./Table";

export default function CreateClassroom({ startingClassroom }: any) {
  const { isLoaded, isSignedIn, user } = useUser();
  const userId = user ? user.id : "";
  const { data, error, isLoading } = useSWR(`/api/clerk?id=` + userId, fetcher);

  const [classroomNumberError, setClassroomNumberError] = useState<string>("");
  const [classroomNumber, setClassroomNumber] = useState<any>("");
  const [classroom, setClassroom] = useState<ClassRoom>(startingClassroom);
  const [tables, setTables] = useState<ClassroomTable[]>();

  useEffect(() => {
    setClassroomNumberError("");
  }, [classroomNumber]);

  useEffect(() => {
    if (!classroom) return;
    getTables();
  }, [classroom]);

  const getTables = async () => {
    if (!classroom) return;
    const response = await axios.get("/api/tables", {
      params: { classroom_id: classroom.id },
    });

    const responseData = await response.data;

    setTables(responseData);

    console.log(responseData);
  };

  const addTable = async () => {
    if (!classroom) return;
    const response = await axios.post("/api/tables", {
      seats: 1,
      classroom_id: classroom.id,
      function: "add",
    });

    const responseData = await response.data;

    getTables();
  };

  const deleteTable = async (room_id: number) => {
    if (!classroom) return;
    console.log(room_id);
    const response = await axios.post("/api/tables", {
      id: room_id,
      function: "delete",
    });

    const responseData = await response.data;

    getTables();
  };

  const addTableSeats = async (room_id: number) => {
    if (!classroom) return;
    const response = await axios.post("/api/tables", {
      id: room_id,
      function: "update",
      seat_function: "add",
    });

    const responseData = await response.data;

    getTables();
  };

  const deleteTableSeats = async (room_id: number) => {
    if (!classroom) return;
    if (!tables) return;

    const tempTable = tables.find((item) => item.id === +room_id);
    if (tempTable && tempTable.seats === 1) {
      deleteTable(tempTable.id);
      return;
    }
    const response = await axios.post("/api/tables", {
      id: room_id,
      function: "update",
      seat_function: "delete",
    });

    const responseData = await response.data;

    getTables();
  };

  const handleCreateClassroom = async () => {
    if (!data) return;

    if (classroomNumber.length < 1) {
      setClassroomNumberError("Required an input");
      return;
    }

    const classNum: number = +classroomNumber;
    if (!classNum) {
      setClassroomNumberError("Has to be valid number");
      return;
    }

    try {
      const response = await axios.post("/api/classroom", {
        room_number: classNum,
        school_id: data.teacher.school_id,
      });

      const responseData = await response.data;

      setClassroom(responseData);
    } catch (error) {
      setClassroomNumberError("Room Exists");
    }
  };

  if (data) console.log(data);
  return (
    <div className={styles.create_classroom}>
      <div className={styles.input_row}>
        <div className={styles.classroom_input}>
          <input
            type="text"
            id="classroom_number"
            className="bg-white-100 border border-white-100 text-black-900 text-sm rounded-lg focus:ring-black-500 focus:border-black-500 block w-full p-2.5 dark:bg-white-100 dark:border-white-600 dark:placeholder-white-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Classroom Number"
            onChange={(event) => setClassroomNumber(event.target.value)}
            required
          />
          {classroomNumberError.length > 0 ? (
            <span className={styles.input_error}>{classroomNumberError}</span>
          ) : (
            <></>
          )}
        </div>
        <Button variant="contained" onClick={() => handleCreateClassroom()}>
          Add Classroom
        </Button>
      </div>
      {classroom ? (
        <>
          <div className={styles.tables_creation}>
            <h5>{classroom.room_number}</h5>
            <Button variant="contained" onClick={() => addTable()}>
              Add Table
            </Button>
          </div>
          <div className={styles.tables}>
            {tables?.map((table, index) => (
              <Table
                table={table}
                key={index}
                deleteTable={deleteTable}
                deleteTableSeats={deleteTableSeats}
                addTableSeats={addTableSeats}
              />
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
