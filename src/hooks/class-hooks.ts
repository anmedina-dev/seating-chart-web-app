import { Class } from "@/interfaces";
import axios from "axios";
import { useState } from "react";

const useClassHook = (data: any) => {
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

    getClasses();
  };

  const deleteClasses = async (period: string) => {
    const response = await axios.post("/api/class", {
      period: period,
      teacher_id: data.teacher.id,
      function: "delete",
    });

    getClasses();
  };

  const getClasses = async () => {
    const response = await axios.get("/api/class", {
      params: { teacher_id: data.teacher.id },
    });
    const responseData = await response.data;

    const sortedData = responseData.sort(
      (a: { period: any }, b: { period: any }) => (a.period > b.period ? 1 : -1)
    );

    setClasses(sortedData);
  };

  return {
    classes,
    getClasses,
    addClasses,
    deleteClasses,
  };
};

export default useClassHook;
