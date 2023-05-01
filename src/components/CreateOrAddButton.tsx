import React from "react";
import styles from "../styles/CreateOrAddButton.module.css";

export default function CreateOrAddButton({ text, handleClick }: any) {
  return (
    <button className={styles.button} onClick={handleClick}>
      {text}
    </button>
  );
}
