import React, { useState } from "react";
import styles from "../styles/Board.module.css";
import AddButton from "./AddButton";
import ClassButton from "./ClassButton";
import ShowClass from "./ShowClass";
import CreateClass from "./CreateClass";

export default function Board() {
  const [buttonSelected, setButtonSelected] = useState<any>("add");
  const handleClick = (period: any) => {
    setButtonSelected(period);
  };
  return (
    <div className={styles.board}>
      <div className={styles.button_column}>
        <AddButton
          period={"add"}
          selected={buttonSelected}
          handleClick={() => handleClick("add")}
        />
        <ClassButton
          period={1}
          selected={buttonSelected}
          handleClick={() => handleClick(1)}
        />
      </div>
      <div className={styles.class_section}>
        {buttonSelected === "add" ? (
          <CreateClass />
        ) : (
          <ShowClass period={buttonSelected} />
        )}
      </div>
    </div>
  );
}
