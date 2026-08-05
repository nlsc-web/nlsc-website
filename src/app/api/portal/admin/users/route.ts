import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { createPortalUser } from "@/lib/portal/services/admin-mutations";

type CreateUserBody = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: "student" | "instructor";
  courseId?: string;
  department?: string;
};

export async function POST(request: Request) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  let body: CreateUserBody;
  try {
    body = (await request.json()) as CreateUserBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const id = body.id?.trim();
  const name = body.name?.trim();
  const email = body.email?.trim();
  const password = body.password?.trim();
  const role = body.role === "instructor" ? "instructor" : "student";

  if (!id || !name || !email || !password) {
    return NextResponse.json(
      { error: "ID, name, email, and password are required." },
      { status: 400 },
    );
  }

  try {
    const user = await createPortalUser({
      id,
      name,
      email,
      password,
      role,
      courseId: body.courseId?.trim(),
      department: body.department?.trim(),
    });
    return NextResponse.json({ success: true, user: { id: user.id, name: user.name } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create user.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
