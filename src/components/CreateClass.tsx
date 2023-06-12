import React, { useState } from "react";
import styles from "../styles/CreateClass.module.css";
import AddClass from "./AddClass";
import CreateClassroom from "./CreateClassroom";
import CreateOrAddButton from "./CreateOrAddButton";

export default function CreateClass({ handleAdd }: any) {
  const [isAddClass, setisAddClass] = useState<Boolean>(true);
  return (
    <div className={styles.create_class}>
      <div className={styles.button_row}>
        <CreateOrAddButton
          text="Add Class"
          handleClick={() => setisAddClass(true)}
        />
        <CreateOrAddButton
          text="Add Classroom"
          handleClick={() => setisAddClass(false)}
        />
      </div>
      {isAddClass ? <AddClass handleAdd={handleAdd} /> : <CreateClassroom />}
    </div>
  );
}
