import { NextRequest, NextResponse } from "next/server";
import { saveStudent, loadStudents } from "@/lib/storage";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  const pw = req.headers.get("x-admin-password");
  if (pw !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(loadStudents());
}

export async function POST(req: NextRequest) {
  const { name, data } = await req.json();
  const record = { id: randomUUID(), name, date: new Date().toISOString(), data };
  saveStudent(record);
  return NextResponse.json({ ok: true });
}
