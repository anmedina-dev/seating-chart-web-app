import React, { useEffect, useState } from "react";
import styles from "../styles/Board.module.css";
import AddButton from "./AddButton";
import ClassButton from "./ClassButton";
import ShowClass from "./ShowClass";
import CreateClass from "./CreateClass";
import useUserHook from "@/hooks/user-hook";
import useClassHook from "@/hooks/class-hooks";
import useBoardHook from "@/hooks/board-hooks";

export default function Board() {
  const { data } = useUserHook();
  const { classes, getClasses, deleteClasses } = useClassHook();
  const [classSelected, setClassSelected] = useState<any>("add");
  // const { classSelected, setClassSelected } = useBoardHook();

  useEffect(() => {
    if (!data) return;
    getClasses();
  }, []);

  useEffect(() => {
    if (!data) return;
    getClasses();
  }, [classSelected]);

  const handleClick = (period: any) => {
    console.log(period);
    setClassSelected(period);
  };

  const handleDelete = () => {
    deleteClasses(classSelected);
    setClassSelected("add");
  };

  const handleAdd = (period: any) => {
    setClassSelected(period);
  };

  return (
    <div className={styles.board}>
      <div className={styles.button_column}>
        <AddButton
          period={"add"}
          selected={classSelected}
          handleClick={() => handleClick("add")}
        />
        {classes?.map((item, index) => (
          <ClassButton
            key={index}
            period={item.period}
            selected={classSelected}
            handleClick={() => handleClick(item.period)}
          />
        ))}
      </div>
      <div className={styles.class_section}>
        {classSelected === "add" ? (
          <CreateClass handleAdd={handleAdd} />
        ) : (
          <ShowClass
            classSelected={classSelected}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
