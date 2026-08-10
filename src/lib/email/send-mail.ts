import nodemailer from "nodemailer";
import { CAMPUS_CONTACT_EMAIL } from "@/lib/site-contact";

type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

function normalizeEnvValue(value: string | undefined) {
  if (!value) return "";
  return value.trim().replace(/^["']|["']$/g, "");
}

export function getGmailCredentials() {
  const user =
    normalizeEnvValue(process.env.GMAIL_USER) || CAMPUS_CONTACT_EMAIL;
  const pass = normalizeEnvValue(process.env.GMAIL_APP_PASSWORD).replace(
    /\s+/g,
    "",
  );

  return { user, pass };
}

export function isMailConfigured() {
  const { pass } = getGmailCredentials();
  return Boolean(pass);
}

export function formatMailError(error: unknown) {
  const raw =
    error instanceof Error
      ? error.message
      : "Unable to send email. Please try again.";

  if (
    /EAUTH|BadCredentials|Username and Password not accepted|535-5\.7\.8/i.test(
      raw,
    )
  ) {
    return new Error(
      `Gmail login failed for ${CAMPUS_CONTACT_EMAIL}. Create a Gmail App Password for this account, add GMAIL_APP_PASSWORD to .env, then restart npm run dev.`,
    );
  }

  if (/not configured/i.test(raw)) {
    return new Error(raw);
  }

  return new Error("Unable to send email right now. Please try again later.");
}

function createGmailTransporter(user: string, pass: string) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

export async function sendMail({ to, subject, text, html }: SendMailInput) {
  const { user, pass } = getGmailCredentials();

  if (!pass) {
    throw new Error(
      `Email is not configured. Add GMAIL_APP_PASSWORD for ${CAMPUS_CONTACT_EMAIL} to your environment.`,
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user)) {
    throw new Error(
      `GMAIL_USER must be a valid Gmail address (for example: ${CAMPUS_CONTACT_EMAIL}).`,
    );
  }

  if (pass.length < 16) {
    throw new Error(
      "GMAIL_APP_PASSWORD looks too short. Generate a 16-character Gmail App Password and add it to .env.",
    );
  }

  const transporter = createGmailTransporter(user, pass);

  try {
    await transporter.sendMail({
      from: `"Next Level Solutions Campus" <${user}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    throw formatMailError(error);
  }
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
