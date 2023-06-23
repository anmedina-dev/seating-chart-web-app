import React, { useEffect, useState } from "react";
import styles from "../styles/CreateClassroom.module.css";
import Button from "@mui/material/Button";
import { ClassRoom } from "@/interfaces";
import axios from "axios";
import Table from "./Table";
import useUserHook from "@/hooks/user-hook";
import useTablesHook from "@/hooks/tables-hooks";

export default function CreateClassroom({ startingClassroom }: any) {
  const { data } = useUserHook();

  const [classroomNumberError, setClassroomNumberError] = useState<string>("");
  const [classroomNumber, setClassroomNumber] = useState<any>("");
  const [classroom, setClassroom] = useState<ClassRoom>(startingClassroom);
  const {
    tables,
    getTables,
    addTable,
    deleteTable,
    addTableSeats,
    deleteTableSeats,
  } = useTablesHook();

  useEffect(() => {
    setClassroomNumberError("");
  }, [classroomNumber]);

  useEffect(() => {
    if (!classroom) return;
    getTables(classroom);
  }, [classroom]);

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
            <Button variant="contained" onClick={() => addTable(classroom)}>
              Add Table
            </Button>
          </div>
          <div className={styles.tables}>
            {tables?.map((table, index) => (
              <Table
                classroom={classroom}
                table={table}
                key={index}
                num={index}
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
