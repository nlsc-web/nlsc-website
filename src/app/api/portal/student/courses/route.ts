import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { getStudentPortalData } from "@/lib/portal/services/student-portal";

export async function GET() {
  const auth = await requirePortalSession("student");
  if (auth.error) return auth.error;

  try {
    const data = await getStudentPortalData(auth.session.studentId);
    return NextResponse.json({ courses: data.courses });
  } catch {
    return NextResponse.json(
      { error: "Unable to load courses." },
      { status: 500 },
    );
  }
}
