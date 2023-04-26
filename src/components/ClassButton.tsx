import React from "react";
import styles from "../styles/Button.module.css";

export default function ClassButton({ period }: any) {
  return (
    <button className={styles.button}>
      <span>{period}</span>
    </button>
  );
}
