export type Student = {
  id: number;
  firstName: string;
  lastName: string;
  school_id?: number | null;
};

export type Class = {
  id: number;
  period: string;
  subject_id: number;
  classroom_id: number;
  teacher_id: number;
};

export type ClassroomTable = {
  id: number;
  seats: number;
  classroom_id: number;
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

export type ShowClass = {
  handleDelete: () => void;
  chosenClass: Class | undefined;
};
