import bcrypt from "bcryptjs";
import type { ApprovalStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { escapeHtml, sendMail } from "@/lib/email/send-mail";

export type AdminSearchResult = {
  students: Array<{ id: string; name: string; email: string; program: string }>;
  instructors: Array<{ id: string; name: string; email: string; department: string }>;
  courses: Array<{ id: string; code: string; title: string; status: string }>;
};

export type CreateUserInput = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "student" | "instructor";
  courseId?: string;
  department?: string;
};

export type CreateCourseInput = {
  id: string;
  code: string;
  title: string;
  duration: string;
  description?: string;
  instructorId?: string;
  status?: "draft" | "active" | "pending";
};

export type CreateAnnouncementInput = {
  title: string;
  body: string;
  audience?: "All" | "Students" | "Instructors" | "Staff";
  status?: "published" | "draft" | "scheduled";
  fromLabel?: string;
};

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

/** Apply domain side-effects when an approval is approved. */
async function applyApprovalSideEffects(
  type: string,
  title: string,
  status: ApprovalStatus,
) {
  if (status !== "approved") return;

  if (type === "Enrollment" && title.includes("Kumarasinghe")) {
    await prisma.user.update({
      where: { id: "STU-1021" },
      data: { status: "active" },
    });
    await prisma.enrollment.updateMany({
      where: { studentId: "STU-1021", status: "pending" },
      data: { status: "active" },
    });
    return;
  }

  if (type === "Staff" && title.includes("Jayasuriya")) {
    await prisma.user.update({
      where: { id: "INS-002" },
      data: { status: "active" },
    });
    return;
  }

  if (type === "Course" && title.includes("Taxation Module 3")) {
    await prisma.course.update({
      where: { id: "taxation-module-3" },
      data: { status: "active" },
    });
  }
}

export async function updateApproval(
  approvalId: string,
  action: "approve" | "reject",
) {
  const approval = await prisma.approval.findUnique({ where: { id: approvalId } });
  if (!approval || approval.status !== "pending") {
    throw new Error("Approval not found or already processed.");
  }

  const status: ApprovalStatus = action === "approve" ? "approved" : "rejected";

  const updated = await prisma.approval.update({
    where: { id: approvalId },
    data: { status },
  });

  await applyApprovalSideEffects(updated.type, updated.title, status);

  return updated;
}

export async function createPortalUser(input: CreateUserInput) {
  const idTaken = await prisma.user.findUnique({ where: { id: input.id } });
  if (idTaken) {
    throw new Error(`User ID "${input.id}" is already taken. Try a different ID.`);
  }

  const emailTaken = await prisma.user.findUnique({ where: { email: input.email } });
  if (emailTaken) {
    throw new Error(`Email "${input.email}" is already registered.`);
  }

  const role: Role = input.role === "instructor" ? "instructor" : "student";
  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      id: input.id,
      name: input.name,
      email: input.email,
      passwordHash,
      role,
      status: "active",
      department: role === "instructor" ? input.department : null,
      notificationPrefs: { create: {} },
    },
  });

  if (role === "student" && input.courseId) {
    const course = await prisma.course.findUnique({ where: { id: input.courseId } });
    if (!course) throw new Error("Selected course not found.");

    await prisma.enrollment.create({
      data: {
        studentId: user.id,
        courseId: input.courseId,
        status: "active",
        progressPercent: 0,
        completedModules: 0,
      },
    });
  }

  return user;
}

export async function enrollPortalStudent(studentId: string, courseId: string) {
  const student = await prisma.user.findFirst({
    where: { id: studentId, role: "student" },
  });
  if (!student) {
    throw new Error("Student not found.");
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    throw new Error("Course not found.");
  }

  const existing = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: { studentId, courseId },
    },
  });
  if (existing) {
    throw new Error(`Student is already enrolled in ${course.code}.`);
  }

  return prisma.enrollment.create({
    data: {
      studentId,
      courseId,
      status: "active",
      progressPercent: 0,
      completedModules: 0,
    },
  });
}

export async function updatePortalUserStatus(
  id: string,
  status: "active" | "pending" | "suspended",
) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("User not found.");
  }
  if (existing.role === "admin") {
    throw new Error("Admin accounts cannot be updated here.");
  }

  return prisma.user.update({
    where: { id },
    data: { status },
  });
}

export type UpdateUserInput = {
  name: string;
  email: string;
  department?: string;
  password?: string;
};

export async function updatePortalUser(id: string, input: UpdateUserInput) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("User not found.");
  }
  if (existing.role === "admin") {
    throw new Error("Admin accounts cannot be updated here.");
  }

  const email = input.email.trim();
  if (!input.name.trim()) {
    throw new Error("Name is required.");
  }
  if (!email) {
    throw new Error("Email is required.");
  }

  const emailTaken = await prisma.user.findFirst({
    where: {
      email: { equals: email, mode: "insensitive" },
      NOT: { id },
    },
  });
  if (emailTaken) {
    throw new Error(`Email "${input.email}" is already registered.`);
  }

  const data: {
    name: string;
    email: string;
    department?: string | null;
    passwordHash?: string;
  } = {
    name: input.name.trim(),
    email,
  };

  if (existing.role === "instructor") {
    data.department = input.department?.trim() || null;
  }

  if (input.password && input.password.trim()) {
    if (input.password.trim().length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
    data.passwordHash = await hashPassword(input.password.trim());
  }

  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function deletePortalUser(id: string) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("User not found.");
  }
  if (existing.role === "admin") {
    throw new Error("Admin accounts cannot be deleted here.");
  }

  await prisma.$transaction([
    prisma.course.updateMany({
      where: { instructorId: id },
      data: { instructorId: null },
    }),
    prisma.announcement.updateMany({
      where: { authorId: id },
      data: { authorId: null },
    }),
    prisma.user.delete({ where: { id } }),
  ]);

  return { id };
}

export async function createPortalCourse(input: CreateCourseInput) {
  const idTaken = await prisma.course.findUnique({ where: { id: input.id } });
  if (idTaken) {
    throw new Error(`Course ID "${input.id}" is already taken.`);
  }

  const codeTaken = await prisma.course.findFirst({
    where: { code: input.code },
  });
  if (codeTaken) {
    throw new Error(`Course code "${input.code}" is already taken.`);
  }

  if (input.instructorId) {
    const instructor = await prisma.user.findFirst({
      where: { id: input.instructorId, role: "instructor" },
    });
    if (!instructor) throw new Error("Instructor not found.");
  }

  return prisma.course.create({
    data: {
      id: input.id,
      code: input.code,
      title: input.title,
      duration: input.duration,
      description: input.description ?? "",
      status: input.status ?? "draft",
      instructorId: input.instructorId,
    },
  });
}

export async function updatePortalCourseStatus(
  id: string,
  status: "draft" | "active" | "pending",
) {
  const existing = await prisma.course.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Course not found.");
  }

  return prisma.course.update({
    where: { id },
    data: { status },
  });
}

export async function deletePortalCourse(id: string) {
  const existing = await prisma.course.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Course not found.");
  }

  await prisma.course.delete({ where: { id } });
  return { id };
}

export async function createPortalAnnouncement(
  input: CreateAnnouncementInput,
  authorId: string,
) {
  const id = `ANN-${Date.now()}`;
  const status = input.status ?? "published";
  const postedAt = status === "published" ? new Date() : null;

  return prisma.announcement.create({
    data: {
      id,
      title: input.title,
      body: input.body,
      audience: input.audience ?? "All",
      status,
      authorId,
      fromLabel: input.fromLabel ?? "NLSC Admin",
      postedAt,
    },
  });
}

export async function updatePortalAnnouncementStatus(
  id: string,
  status: "published" | "draft" | "scheduled",
) {
  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Announcement not found.");
  }

  return prisma.announcement.update({
    where: { id },
    data: {
      status,
      postedAt:
        status === "published"
          ? existing.postedAt ?? new Date()
          : status === "draft"
            ? null
            : existing.postedAt,
    },
  });
}

export async function deletePortalAnnouncement(id: string) {
  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Announcement not found.");
  }

  await prisma.announcement.delete({ where: { id } });
  return { id };
}

export async function searchAdminPortal(query: string): Promise<AdminSearchResult> {
  const q = query.trim();
  if (!q) {
    return { students: [], instructors: [], courses: [] };
  }

  const [students, instructors, courses, enrollments] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: "student",
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { id: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 8,
      orderBy: { joinedAt: "desc" },
    }),
    prisma.user.findMany({
      where: {
        role: "instructor",
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { id: { contains: q, mode: "insensitive" } },
          { department: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 8,
      orderBy: { joinedAt: "desc" },
    }),
    prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { code: { contains: q, mode: "insensitive" } },
          { id: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 8,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.enrollment.findMany({
      where: { status: { in: ["active", "pending"] } },
      include: { course: { select: { code: true } } },
    }),
  ]);

  const programByStudent = new Map<string, string>();
  for (const enrollment of enrollments) {
    if (!programByStudent.has(enrollment.studentId)) {
      programByStudent.set(enrollment.studentId, enrollment.course.code);
    }
  }

  return {
    students: students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      program: programByStudent.get(s.id) ?? "—",
    })),
    instructors: instructors.map((i) => ({
      id: i.id,
      name: i.name,
      email: i.email,
      department: i.department ?? "NLSC Faculty",
    })),
    courses: courses.map((c) => ({
      id: c.id,
      code: c.code,
      title: c.title,
      status: c.status,
    })),
  };
}

export async function updateContactInquiryStatus(
  id: string,
  status: "unread" | "read",
) {
  const existing = await prisma.contactInquiry.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Message not found.");
  }

  return prisma.contactInquiry.update({
    where: { id },
    data: { status },
  });
}

export async function deleteContactInquiry(id: string) {
  const existing = await prisma.contactInquiry.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Message not found.");
  }

  await prisma.contactInquiry.delete({ where: { id } });
  return { id };
}

export async function replyToContactInquiry(id: string, replyMessage: string) {
  const inquiry = await prisma.contactInquiry.findUnique({ where: { id } });
  if (!inquiry) {
    throw new Error("Message not found.");
  }

  const message = replyMessage.trim();
  if (!message) {
    throw new Error("Reply message is required.");
  }

  const subject = `Re: ${inquiry.subject ?? "General inquiry"}`;
  const originalBlock = [
    "",
    "---",
    `Original message from ${inquiry.name} (${inquiry.email}):`,
    inquiry.message,
  ].join("\n");

  await sendMail({
    to: inquiry.email,
    subject,
    text: `${message}${originalBlock}`,
    html: `
      <p style="white-space:pre-wrap;font-family:sans-serif;line-height:1.5">${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0" />
      <p style="font-family:sans-serif;font-size:13px;color:#525252;line-height:1.5">
        <strong>Original message from ${escapeHtml(inquiry.name)}</strong>
        (${escapeHtml(inquiry.email)}):<br><br>
        ${escapeHtml(inquiry.message).replace(/\n/g, "<br>")}
      </p>
    `,
  });

  return prisma.contactInquiry.update({
    where: { id },
    data: { status: "read" },
  });
}
