import { NextRequest, NextResponse } from "next/server";
import { saveStudent, loadStudents } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const pw = req.headers.get("x-admin-password");
  if (pw !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const students = await loadStudents();
  return NextResponse.json(students);
}

export async function POST(req: NextRequest) {
  const { name, data } = await req.json();
  await saveStudent({ name, date: new Date().toISOString(), data });
  return NextResponse.json({ ok: true });
}
