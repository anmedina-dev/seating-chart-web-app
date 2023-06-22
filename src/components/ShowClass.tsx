import React, { useEffect, useState } from "react";
import styles from "../styles/ShowClass.module.css";
import { Button, ButtonGroup } from "@mui/material";
import { ClassroomTable, ShowClass, Student } from "@/interfaces";
import axios from "axios";
import TableLayout from "./TableLayout";

export default function ShowClass({ handleDelete, chosenClass }: ShowClass) {
  const [subject, setSubject] = useState("");
  const [tableInfo, setTableInfo] = useState<ClassroomTable[]>();
  const [totalSeats, setTotalSeats] = useState<number>(0);
  const [studentFirstName, setStudentFirstName] = useState<string>("");
  const [studentFirstNameError, setStudentFirstNameError] =
    useState<boolean>(false);
  const [studentLastName, setStudentLastName] = useState<string>("");
  const [studentLastNameError, setStudentLastNameError] =
    useState<boolean>(false);
  const [studentCountError, setStudentCountError] = useState<boolean>(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [shuffleStudents, setShuffleStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (!chosenClass) return;
    getClassInfo();
  }, [chosenClass]);

  useEffect(() => {
    if (!tableInfo) return;
    getClassroomTables();
  }, [tableInfo]);

  useEffect(() => {
    setStudentFirstNameError(false);
    setStudentLastNameError(false);
    setStudentCountError(false);
  }, [studentFirstName, studentLastName]);

  const getClassInfo = async () => {
    // Get Subject
    const subject_response = await axios.get("/api/subject");
    const subjectName = subject_response.data.find(
      (x: any) => x.id === chosenClass?.subject_id
    );
    setSubject(subjectName.name);

    //Get Table Info
    const table_response = await axios.get("/api/tables", {
      params: { classroom_id: chosenClass?.classroom_id },
    });

    setTableInfo(table_response.data);

    //Get Students
    getStudents();
  };

  const getClassroomTables = async () => {
    if (!tableInfo) return;
    let temp = 0;
    for (const x of tableInfo) {
      temp = temp + x.seats;
    }
    setTotalSeats(temp);
  };

  const getStudents = async () => {
    const student_enrollment_response = await axios.get(
      "/api/studentenrollment",
      {
        params: { id: chosenClass?.id },
      }
    );

    setStudents(student_enrollment_response.data.students);
    setShuffleStudents(student_enrollment_response.data.students);
  };

  const addStudent = async () => {
    if (!chosenClass) return;
    const errors = handleErrors();
    if (errors) return;

    try {
      const student_enrollment = await axios.post("/api/studentenrollment", {
        id: chosenClass.id,
        firstname: studentFirstName,
        lastname: studentLastName,
        classroom_id: chosenClass.classroom_id,
        method: "add",
      });
      await getStudents();
    } catch {
      setStudentCountError(true);
      setTimeout(() => {}, 5000);
    }
    setStudentFirstName("");
    setStudentLastName("");
  };

  const deleteStudent = async (student: Student) => {
    if (!student) return;
    const student_enrollment = await axios.post("/api/studentenrollment", {
      id: student.id,
      method: "delete",
    });

    await getStudents();
  };

  const shuffle = () => {
    let currentIndex = students.length,
      randomIndex;
    let tempStudentArray = JSON.parse(JSON.stringify(students));

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [tempStudentArray[currentIndex], tempStudentArray[randomIndex]] = [
        tempStudentArray[randomIndex],
        tempStudentArray[currentIndex],
      ];
    }

    setShuffleStudents(tempStudentArray);
  };

  const handleErrors = () => {
    let errors = false;

    if (studentFirstName?.length < 1) {
      setStudentFirstNameError(true);
      errors = true;
    }

    if (studentLastName?.length < 1) {
      setStudentLastNameError(true);
      errors = true;
    }

    return errors;
  };

  if (!chosenClass) return <>...loading...</>;
  return (
    <div className={styles.show_class}>
      <div className={styles.header}>
        <span className={styles.info}>
          Period {chosenClass.period} : {subject}
        </span>
        <ButtonGroup variant="contained" className={styles.button_group}>
          <Button onClick={shuffle}>Randomize Students</Button>
          <Button onClick={handleDelete}>Delete Class</Button>
        </ButtonGroup>
      </div>
      <div className={styles.show_class_main_section}>
        <div className={styles.tables}>
          {tableInfo && (
            <TableLayout
              students={shuffleStudents}
              tables={tableInfo}
              totalSeats={totalSeats}
            />
          )}
        </div>
        <div className={styles.student_enrollment}>
          <span className={styles.total_seats}>
            Total amount of seats: {totalSeats}
          </span>
          <div className={styles.students}>
            {students?.map((student, index) => (
              <div key={index} className={styles.student}>
                <span>
                  {index + 1}. {student.firstName} {student.lastName}
                </span>

                <Button
                  variant="contained"
                  onClick={(e) => deleteStudent(student)}
                >
                  Delete Student
                </Button>
              </div>
            ))}
          </div>
          <div className={styles.student_input_section}>
            <div className={styles.student_firstname_input}>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-grey-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="Student First Name"
                value={studentFirstName}
                onChange={(event) => setStudentFirstName(event.target.value)}
              />
              {studentFirstNameError ? (
                <p className="text-red-500 text-xs italic">
                  Please fill out this field.
                </p>
              ) : (
                <></>
              )}
            </div>
            <div className={styles.student_firstname_input}>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-grey-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="Student Last Name"
                value={studentLastName}
                onChange={(event) => setStudentLastName(event.target.value)}
              />
              {studentLastNameError ? (
                <p className="text-red-500 text-xs italic">
                  Please fill out this field.
                </p>
              ) : (
                <></>
              )}
            </div>

            <Button variant="contained" onClick={addStudent}>
              Add Student
            </Button>
            {studentCountError ? (
              <p className="text-red-500 text-xs italic">
                Too many students for this classroom of size {totalSeats}
              </p>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
