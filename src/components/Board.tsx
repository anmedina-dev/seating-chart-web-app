import React from "react";
import styles from "../styles/Board.module.css";
import AddButton from "./AddButton";
import ClassButton from "./ClassButton";

export default function Board() {
  return (
    <div className={styles.board}>
      <div className={styles.button_column}>
        <AddButton />
        <ClassButton period={1} />
      </div>
      <div className={styles.class_section}>class</div>
    </div>
  );
}
