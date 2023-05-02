import React, { useEffect, useState } from "react";
import styles from "../styles/Board.module.css";
import AddButton from "./AddButton";
import ClassButton from "./ClassButton";
import ShowClass from "./ShowClass";
import CreateClass from "./CreateClass";
import useSWR from "swr";
import { useUser } from "@clerk/nextjs";
import fetcher from "@/lib/fetch";
import { Class } from "@/interfaces";
import axios from "axios";

export default function Board() {
  const { isLoaded, isSignedIn, user } = useUser();
  const userId = user ? user.id : "";
  const { data, error, isLoading } = useSWR(`/api/clerk?id=` + userId, fetcher);
  const [classes, setClasses] = useState<Class[]>();
  const [buttonSelected, setButtonSelected] = useState<any>("add");

  useEffect(() => {
    if (!data) return;
    getClasses();
  }, [data]);

  const handleClick = (period: any) => {
    setButtonSelected(period);
  };

  const getClasses = async () => {
    const response = await axios.get("/api/class", {
      params: { teacher_id: data.teacher.id },
    });
    const responseData = await response.data;
    console.log(responseData);
    setClasses(responseData);
  };

  return (
    <div className={styles.board}>
      <div className={styles.button_column}>
        <AddButton
          period={"add"}
          selected={buttonSelected}
          handleClick={() => handleClick("add")}
        />
        {classes?.map((item) => (
          <ClassButton
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
