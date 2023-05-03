import React from "react";
import styles from "../styles/ShowClass.module.css";
import useUserHook from "@/hooks/user-hook";
import { Button } from "@mui/material";
import useClassHook from "@/hooks/class-hooks";

export default function ShowClass({ period }: any) {
  const { data } = useUserHook();
  const { deleteClasses } = useClassHook();

  return (
    <div className={styles.show_class}>
      <div className={styles.header}>
        <span>ShowClass {period}</span>
        <Button variant="contained" onClick={() => deleteClasses(period)}>
          Delete Class
        </Button>
      </div>
    </div>
  );
}
