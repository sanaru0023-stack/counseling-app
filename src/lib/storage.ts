import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "students.json");

export type StudentRecord = {
  id: string;
  name: string;
  date: string;
  data: Record<string, string>;
};

function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

export function loadStudents(): StudentRecord[] {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

export function saveStudent(record: StudentRecord) {
  ensureFile();
  const students = loadStudents();
  students.push(record);
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2), "utf-8");
}
