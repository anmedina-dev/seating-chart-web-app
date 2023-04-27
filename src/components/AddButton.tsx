import React from "react";
import styles from "../styles/Button.module.css";

export default function AddButton({ period, selected, handleClick }: any) {
  const hoverClass =
    period === selected ? styles.button_selected : styles.button;
  return (
    <button className={hoverClass} onClick={handleClick}>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={styles.svg}
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path
            fill="currentColor"
            d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
          ></path>
        </svg>
      </span>
    </button>
  );
}
