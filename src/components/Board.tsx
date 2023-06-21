import React, { useEffect, useState } from "react";
import styles from "../styles/Board.module.css";
import AddButton from "./AddButton";
import ClassButton from "./ClassButton";
import ShowClass from "./ShowClass";
import CreateClass from "./CreateClass";
import useUserHook from "@/hooks/user-hook";
import useClassHook from "@/hooks/class-hooks";
import { Class } from "@/interfaces";

export default function Board() {
  const { data } = useUserHook();
  const { classes, getClasses, deleteClasses } = useClassHook(data);
  const [classSelected, setClassSelected] = useState<any>("add");
  const [chosenClass, setChosenClass] = useState<Class>();

  useEffect(() => {
    if (!data) return;
    getClasses();
  }, []);

  useEffect(() => {
    if (!data) return;
    updateShowClass();
  }, [classSelected]);

  const updateShowClass = () => {
    if (classSelected === "add") return;
    const findChosenClass = classes?.find((x) => x.period === classSelected);
    setChosenClass(findChosenClass);
  };

  const handleClick = (period: any) => {
    setClassSelected(period);
  };

  const handleDelete = () => {
    deleteClasses(classSelected);
    setClassSelected("add");
  };

  const handleAdd = async (period: any) => {
    await getClasses();
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
          <ShowClass handleDelete={handleDelete} chosenClass={chosenClass} />
        )}
      </div>
    </div>
  );
}
