import React from "react";
import styles from "../styles/ShowClass.module.css";
import useUserHook from "@/hooks/user-hook";
import { Button } from "@mui/material";
import useClassHook from "@/hooks/class-hooks";
import useBoardHook from "@/hooks/board-hooks";

export default function ShowClass({ classSelected, handleDelete }: any) {
  const { data } = useUserHook();

  return (
    <div className={styles.show_class}>
      <div className={styles.header}>
        <span>ShowClass {classSelected}</span>
        <Button variant="contained" onClick={handleDelete}>
          Delete Class
        </Button>
      </div>
    </div>
  );
}
