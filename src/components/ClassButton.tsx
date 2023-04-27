import React from "react";
import styles from "../styles/Button.module.css";

export default function ClassButton({ period, selected, handleClick }: any) {
  const hoverClass =
    period === selected ? styles.button_selected : styles.button;
  return (
    <button className={hoverClass} onClick={handleClick}>
      <span>{period}</span>
    </button>
  );
}
