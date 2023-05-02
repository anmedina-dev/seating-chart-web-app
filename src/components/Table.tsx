import React from "react";
import styles from "../styles/Table.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

export default function Table({
  table,
  deleteTable,
  deleteTableSeats,
  addTableSeats,
}: any) {
  return (
    <div className={styles.table}>
      <DeleteIcon
        id={table.id}
        className={styles.icon}
        onClick={(event) => deleteTable(event.currentTarget.id)}
      />
      <div className={styles.table_info}>
        <h3>Table: </h3>
        <div className={styles.seat_section}>
          <RemoveCircleIcon
            className={styles.icon}
            id={table.id}
            onClick={(event) => deleteTableSeats(event.currentTarget.id)}
          />
          <h3>{table.seats}</h3>
          <AddCircleIcon
            className={styles.icon}
            id={table.id}
            onClick={(event) => addTableSeats(event.currentTarget.id)}
          />
        </div>
      </div>
    </div>
  );
}
