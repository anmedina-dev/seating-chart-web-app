import { useEffect, useState } from "react";
import useUserHook from "./user-hook";
import useClassHook from "./class-hooks";

const useBoardHook = () => {
  const { data } = useUserHook();
  const { getClasses } = useClassHook();
  const [classSelected, setClassSelected] = useState<any>("add");
  useEffect(() => {
    if (!data) return;
    getClasses();
  }, [classSelected]);
  return { classSelected, setClassSelected };
};

export default useBoardHook;
