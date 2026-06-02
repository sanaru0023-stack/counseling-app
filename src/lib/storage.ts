export type StudentRecord = {
  id: string;
  name: string;
  date: string;
  data: Record<string, string>;
};

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

async function supabase(method: string, body?: object) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/students`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_SERVICE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Prefer": method === "POST" ? "return=minimal" : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res;
}

export async function loadStudents(): Promise<StudentRecord[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/students?order=date.desc`, {
    headers: {
      "apikey": SUPABASE_SERVICE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function saveStudent(record: Omit<StudentRecord, "id">) {
  await supabase("POST", {
    name: record.name,
    date: record.date,
    data: record.data,
  });
}
