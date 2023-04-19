export type Student = {
  id: number;
  name: string;
  school: string;
};

export type Class = {
  numberOfStudents: number;
  students: Student[];
};

export type ClassRoomTable = {
  numberOfChairs: number;
  students: Student[];
};

export type ClassRoom = {
  tables: ClassRoomTable[];
};

export type Teacher = {
  name: string;
  school: string;
};
