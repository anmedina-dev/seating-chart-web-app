import { ClassroomTable, Student } from "@/interfaces";
import styles from "../styles/ShowClass.module.css";
import React from "react";

interface TableLayout {
  students: Student[];
  tables: ClassroomTable[];
  totalSeats: number;
}

export default function TableLayout({
  students,
  tables,
  totalSeats,
}: TableLayout) {
  const seatSum = [];
  let seatCount = 0;

  for (const x of tables) {
    seatCount = seatCount + x.seats;
    seatSum.push(seatCount);
  }

  const seats: any[] = [];
  let tableNum = 0;
  let table: any[] = [];
  for (let i = 0; i < totalSeats; i++) {
    if (i < students.length) {
      const student = (
        <div className={styles.name}>
          <span className={styles.firstname}>{students[i].firstName}</span>
          <span className={styles.lastname}>{students[i].lastName}</span>
        </div>
      );
      table.push(student);
    } else {
      const student = (
        <div className={styles.name}>
          <span className={styles.firstname}>Empty</span>
          <span className={styles.lastname}>Seat</span>
        </div>
      );
      table.push(student);
    }

    if (i === seatSum[tableNum] - 1) {
      const tableElement = (
        <div key={tableNum} className={styles.table_layout_table}>
          <h2>Table {tableNum + 1}</h2>
          <div className={styles.table_seats}>{table}</div>
        </div>
      );
      seats.push(tableElement);
      table = [];
      tableNum++;
    } else {
      const vertLine = <div className={styles.vl}></div>;
      table.push(vertLine);
    }
  }

  return <div className={styles.table_layout}>{seats}</div>;
}
