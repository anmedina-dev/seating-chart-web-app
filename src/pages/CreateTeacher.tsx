import fetcher from "@/lib/fetch";
import { UserButton } from "@clerk/nextjs";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { useEffect, useState } from "react";
import styles from "../styles/CreateTeacher.module.css";
import useSWR from "swr";
import { GetServerSideProps } from "next";

export default function CreateTeacher({ userId }: any) {
  const { data } = useSWR<any>(`/api/schools`, fetcher);

  let schools: (string | undefined)[] = [];

  if (data) schools = data.map((school: { name: any }) => school.name);
  schools.push("Other");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [schoolDropdown, setSchoolDropdown] = useState<string>();
  const [isOther, setIsOther] = useState<boolean>(false);
  const [schoolType, setSchoolType] = useState<string>();

  const [firstNameError, setFirstNameError] = useState<boolean>(false);
  const [lastNameError, setLastNameError] = useState<boolean>(false);
  const [schoolTypeError, setSchoolTypeError] = useState<boolean>(false);

  useEffect(() => {
    if (schoolDropdown === "Other") setIsOther(true);
    else setIsOther(false);
  }, [schoolDropdown]);

  useEffect(() => {
    setFirstNameError(false);
    setLastNameError(false);
    setSchoolTypeError(false);
  }, [firstName, lastName, schoolType]);

  const handleSubmit = async () => {
    const errors = handleErrors();
    if (errors) return;

    await fetch("/api/clerk", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        school: isOther ? schoolType : schoolDropdown,
        clerk_id: userId,
      }),
    }).then((res) => res.json());
  };

  const handleErrors = () => {
    let areThereErrrors = false;

    if (firstName.length < 1) {
      setFirstNameError(true);
      areThereErrrors = true;
    }

    if (lastName.length < 1) {
      setLastNameError(true);
      areThereErrrors = true;
    }

    if (schools.includes(schoolType)) {
      setSchoolTypeError(true);
      areThereErrrors = true;
    }

    return areThereErrrors;
  };

  if (!data) return <div>...Loading</div>;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <header className={styles.header}>
        <h1>Seating Chart Web App</h1>
        <UserButton showName={true} />
      </header>

      <h1 className="mb-10">
        Looks like you're new! Add some info about yourself before creating your
        classroom!
      </h1>
      <form className="w-full max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              First Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-grey-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-first-name"
              type="text"
              placeholder="Jane"
              onChange={(event) => setFirstName(event.target.value)}
            />
            {firstNameError ? (
              <p className="text-red-500 text-xs italic">
                Please fill out this field.
              </p>
            ) : (
              <></>
            )}
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              Last Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-last-name"
              type="text"
              placeholder="Doe"
              onChange={(event) => setLastName(event.target.value)}
            />
            {lastNameError ? (
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
              School
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-school-dropdown"
                onChange={(event) => setSchoolDropdown(event.target.value)}
              >
                {schools.map((school: any, index: number) => (
                  <option key={index}>{school}</option>
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
        {isOther ? (
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-school"
              >
                Add New School
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-school"
                type="text"
                placeholder="School"
                onChange={(event) => setSchoolType(event.target.value)}
              />
              {schoolTypeError ? (
                <p className="text-red-500 text-xs italic">
                  This school already exists
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
            onClick={handleSubmit}
          >
            Sign Up
          </button>
        </div>
      </form>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);
  const { URL } = process.env;

  if (!userId) {
    // handle user is not logged in.
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }

  const res = await fetch(`${URL}/api/clerk?id=` + userId, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const user = await res.json();
  if (user) {
    // Attach extra info to the error object.

    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }

  return { props: { ...buildClerkProps(ctx.req), userId } };
};
