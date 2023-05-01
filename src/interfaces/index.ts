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
  id: number;
  room_number: number;
  school_id: number;
};

export type Teacher = {
  name: string;
  school: string;
};
