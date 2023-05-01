import React from "react";
import styles from "../styles/Button.module.css";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";

export default function AddButton({ period, selected, handleClick }: any) {
  const hoverClass =
    period === selected ? styles.button_selected : styles.button;
  return (
    <button className={hoverClass} onClick={handleClick}>
      <span>
        <AddIcon fontSize="large" />
      </span>
    </button>
  );
}
