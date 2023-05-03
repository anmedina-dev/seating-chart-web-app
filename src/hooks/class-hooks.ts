import { Class } from "@/interfaces";
import axios from "axios";
import useUserHook from "./user-hook";
import { useState } from "react";

const useClassHook = () => {
  const { data } = useUserHook();
  const [classes, setClasses] = useState<Class[]>();

  const addClasses = async (
    period: string,
    subjectBody: string,
    classroomId: number
  ) => {
    const response = await axios.post("/api/class", {
      period: period,
      subject: subjectBody,
      classroom_id: classroomId,
      teacher_id: data.teacher.id,
      function: "add",
    });

    const responseData = await response.data;

    getClasses();
  };

  const deleteClasses = async (period: string) => {
    const response = await axios.post("/api/class", {
      period: period,
      teacher_id: data.teacher.id,
      function: "delete",
    });

    const responseData = await response.data;

    getClasses();
  };

  const getClasses = async () => {
    const response = await axios.get("/api/class", {
      params: { teacher_id: data.teacher.id },
    });
    const responseData = await response.data;
    console.log(responseData);
    setClasses(responseData);
  };

  return { classes, getClasses, addClasses, deleteClasses };
};

export default useClassHook;
