import React, { useEffect, useState } from "react";
import styles from "../styles/Board.module.css";
import AddButton from "./AddButton";
import ClassButton from "./ClassButton";
import ShowClass from "./ShowClass";
import CreateClass from "./CreateClass";
import useUserHook from "@/hooks/user-hook";
import useClassHook from "@/hooks/class-hooks";

export default function Board() {
  const { data } = useUserHook();
  const { classes, getClasses } = useClassHook();
  const [buttonSelected, setButtonSelected] = useState<any>("add");

  useEffect(() => {
    if (!data) return;
    getClasses();
  }, []);

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
        {classes?.map((item, index) => (
          <ClassButton
            key={index}
            period={item.period}
            selected={buttonSelected}
            handleClick={() => handleClick(item.period)}
          />
        ))}
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
