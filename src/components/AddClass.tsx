import fetcher from "@/lib/fetch";
import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { ClassRoom } from "@/interfaces";
import axios from "axios";
import styles from "../styles/AddClass.module.css";

export default function AddClass() {
  const { isLoaded, isSignedIn, user } = useUser();
  const userId = user ? user.id : "";
  const { data, error, isLoading } = useSWR(`/api/clerk?id=` + userId, fetcher);
  const [period, setPeriod] = useState<any>("");
  const [periodError, setPeriodError] = useState<boolean>(false);
  const [classrooms, setClassrooms] = useState<ClassRoom[]>();
  const [classroomChoice, setClassroomChoice] = useState<any>();
  const [subjectChoice, setSubjectChoice] = useState<any>("");
  const [subjectText, setSubjectText] = useState<string>("");
  const [subjectTextError, setSubjectTextError] = useState<boolean>(false);
  const [subjectTextErrorText, setSubjectTextErrorText] = useState<string>("");
  const [classroomDropdown, setClassroomDropdown] = useState<any[]>();
  const [subjectDropdown, setSubjectDropdown] = useState<string[]>();
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [createClassError, setCreateClassError] = useState<string>("");

  useEffect(() => {
    if (!data) return;
    const school_id = data.teacher.school_id;
    getClassrooms(school_id);
    getSubjects();
  }, [data]);

  const getClassrooms = async (school_id: any) => {
    const classroomResponse = await axios.get("/api/classroom", {
      params: { school_id: school_id },
    });
    const data = await classroomResponse.data;
    console.log(data);
    setClassrooms(data);
  };

  const getSubjects = async () => {
    const subjectResponse = await axios.get("/api/subject");
    const data = await subjectResponse.data;
    console.log(data);
    const subjects = data.map((subject: { name: string }) => subject.name);
    subjects.push("Other");
    console.log(subjects);
    setSubjectDropdown(subjects);
  };

  useEffect(() => {
    if (!isLoaded || !user || isLoading) return;
    setPeriodError(false);
    setSubjectTextError(false);
    setCreateClassError("");
  }, [subjectText, period, classroomChoice]);

  useEffect(() => {
    if (!classrooms) return;
    const classroomDropdownTemp = classrooms.map((data) => data.room_number);
    setClassroomDropdown(
      classroomDropdownTemp.sort(function (a, b) {
        return a - b;
      })
    );
  }, [classrooms]);

  useEffect(() => {
    if (!classroomDropdown) return;
    setClassroomChoice(classroomDropdown[0]);
  }, [classroomDropdown]);

  useEffect(() => {
    if (!subjectDropdown) return;
    setSubjectChoice(subjectDropdown[0]);
  }, [subjectDropdown]);

  const handleSubmit = async () => {
    if (!isLoaded || !user || isLoading || !classrooms) return;
    const errors = handleErrors();
    if (errors) return;

    const subjectBody = subjectChoice === "Other" ? subjectText : subjectChoice;

    const classroomId = classrooms.find(
      (item) => item.room_number === +classroomChoice
    );
    console.log(classroomId);

    try {
      const response = await axios.post("/api/class", {
        period: period,
        subject: subjectBody,
        classroom_id: classroomId?.id,
        teacher_id: data.teacher.id,
      });

      const responseData = await response.data;

      setIsAlertVisible(true);
      setTimeout(() => {
        setIsAlertVisible(false);
      }, 3000);
    } catch (error) {
      setCreateClassError("Couldn't Create Class");
    }
  };
  const handleErrors = () => {
    let areThereErrrors = false;

    if (period.length < 1) {
      setPeriodError(true);
      areThereErrrors = true;
    }

    if (subjectChoice === "Other") {
      console.log(subjectText);
      if (subjectText.length < 1) {
        setSubjectTextError(true);
        setSubjectTextErrorText("Fill in this field");
        areThereErrrors = true;
      }
      if (subjectDropdown && subjectDropdown.includes(subjectText)) {
        setSubjectTextErrorText("Subject exsists");
        setSubjectTextError(true);
        areThereErrrors = true;
      }
    }

    return areThereErrrors;
  };

  if (!isLoaded || !user || isLoading) return <div>...Loading</div>;
  return (
    <div className={styles.add_class}>
      <form className="w-full max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Period
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-grey-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-first-name"
              type="text"
              placeholder="A or 1"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            />
            {periodError ? (
              <p className="text-red-500 text-xs italic">
                Please fill out this field.
              </p>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-school-dropdown"
            >
              Classroom
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-school-dropdown"
                onChange={(event) => setClassroomChoice(event.target.value)}
              >
                {classroomDropdown &&
                  classroomDropdown.map(
                    (room_number: string, index: number) => (
                      <option key={index}>{room_number}</option>
                    )
                  )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-school-dropdown"
            >
              Subject
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-school-dropdown"
                onChange={(event) => setSubjectChoice(event.target.value)}
              >
                {subjectDropdown &&
                  subjectDropdown.map((subject: string, index: number) => (
                    <option key={index}>{subject}</option>
                  ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {subjectChoice === "Other" ? (
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-school"
              >
                Add Subject
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-school"
                type="text"
                placeholder="Subject"
                value={subjectText}
                onChange={(event) => setSubjectText(event.target.value)}
              />
              {subjectTextError ? (
                <p className="text-red-500 text-xs italic">
                  {subjectTextErrorText}
                </p>
              ) : (
                <></>
              )}
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="md:flex md:items-center">
          <button
            className="w-full mt-3 shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={() => handleSubmit()}
          >
            Add Class
          </button>
        </div>
        {isAlertVisible ? (
          <div className="md:flex md:items-center">
            <div className="w-full mt-3 shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
              Class added successfully
            </div>
          </div>
        ) : (
          <></>
        )}
        {createClassError.length > 0 ? (
          <p className="text-red-500 text-xs italic">{createClassError}</p>
        ) : (
          <></>
        )}
      </form>
    </div>
  );
}
