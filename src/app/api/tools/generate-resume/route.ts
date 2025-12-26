import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { incrementStat } from "@/lib/stats";

const workExperienceSchema = z.object({
  id: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  isCurrentRole: z.boolean(),
  description: z.string(),
});

const educationSchema = z.object({
  id: z.string(),
  degree: z.string(),
  school: z.string(),
  location: z.string(),
  graduationDate: z.string(),
  gpa: z.string().optional(),
});

const languageSchema = z.object({
  id: z.string(),
  language: z.string(),
  proficiency: z.enum(["Native", "Fluent", "Advanced", "Intermediate", "Basic"]),
});

const resumeSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
  location: z.string(),
  linkedIn: z.string().optional(),
  portfolio: z.string().optional(),
  summary: z.string(),
  workExperience: z.array(workExperienceSchema),
  education: z.array(educationSchema),
  skills: z.string(),
  languages: z.array(languageSchema),
});

function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateResumeHTML(data: z.infer<typeof resumeSchema>): string {
  const hasWorkExperience = data.workExperience.some(
    (exp) => exp.jobTitle || exp.company
  );
  const hasEducation = data.education.some((edu) => edu.degree || edu.school);
  const hasSkills = data.skills.trim().length > 0;
  const hasLanguages = data.languages.some((lang) => lang.language);

  const workExperienceHTML = hasWorkExperience
    ? `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 12px; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; margin-bottom: 16px;">
        Work Experience
      </h2>
      ${data.workExperience
        .filter((exp) => exp.jobTitle || exp.company)
        .map(
          (exp) => `
        <div style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h3 style="font-size: 14px; font-weight: 600; color: #111827; margin: 0;">
                ${escapeHtml(exp.jobTitle || "Job Title")}
              </h3>
              <p style="font-size: 13px; color: #4b5563; margin: 2px 0 0 0;">
                ${escapeHtml(exp.company)}${exp.location ? ` | ${escapeHtml(exp.location)}` : ""}
              </p>
            </div>
            <p style="font-size: 12px; color: #6b7280; margin: 0; text-align: right; white-space: nowrap;">
              ${formatDate(exp.startDate)}${exp.startDate ? " - " : ""}${exp.isCurrentRole ? "Present" : formatDate(exp.endDate)}
            </p>
          </div>
          ${
            exp.description
              ? `<div style="margin-top: 8px; font-size: 13px; color: #374151; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(exp.description)}</div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>
  `
    : "";

  const educationHTML = hasEducation
    ? `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 12px; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; margin-bottom: 16px;">
        Education
      </h2>
      ${data.education
        .filter((edu) => edu.degree || edu.school)
        .map(
          (edu) => `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div>
            <h3 style="font-size: 14px; font-weight: 600; color: #111827; margin: 0;">
              ${escapeHtml(edu.degree || "Degree")}
            </h3>
            <p style="font-size: 13px; color: #4b5563; margin: 2px 0 0 0;">
              ${escapeHtml(edu.school)}${edu.location ? ` | ${escapeHtml(edu.location)}` : ""}${edu.gpa ? ` | GPA: ${escapeHtml(edu.gpa)}` : ""}
            </p>
          </div>
          <p style="font-size: 12px; color: #6b7280; margin: 0;">
            ${formatDate(edu.graduationDate)}
          </p>
        </div>
      `
        )
        .join("")}
    </div>
  `
    : "";

  const skillsHTML = hasSkills
    ? `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 12px; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; margin-bottom: 16px;">
        Skills
      </h2>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${data.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
          .map(
            (skill) => `
          <span style="display: inline-block; padding: 4px 10px; background: #f3f4f6; color: #374151; font-size: 12px; border-radius: 4px;">
            ${escapeHtml(skill)}
          </span>
        `
          )
          .join("")}
      </div>
    </div>
  `
    : "";

  const languagesHTML = hasLanguages
    ? `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 12px; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; margin-bottom: 16px;">
        Languages
      </h2>
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        ${data.languages
          .filter((lang) => lang.language)
          .map(
            (lang) => `
          <span style="font-size: 13px; color: #374151;">
            <strong>${escapeHtml(lang.language)}</strong> - ${lang.proficiency}
          </span>
        `
          )
          .join("")}
      </div>
    </div>
  `
    : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #374151;
          line-height: 1.5;
          background: white;
        }
        .resume {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 48px;
        }
        @media print {
          .resume {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="resume">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 2px solid #111827; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="font-size: 28px; font-weight: 700; color: #111827; letter-spacing: 0.05em; margin-bottom: 8px;">
            ${escapeHtml(data.fullName)}
          </h1>

          <!-- Contact Info -->
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; font-size: 13px; color: #4b5563; margin-bottom: 4px;">
            ${data.email ? `<span>${escapeHtml(data.email)}</span>` : ""}
            ${data.phone ? `<span>${escapeHtml(data.phone)}</span>` : ""}
            ${data.location ? `<span>${escapeHtml(data.location)}</span>` : ""}
          </div>

          <!-- Links -->
          ${
            data.linkedIn || data.portfolio
              ? `
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; font-size: 13px; color: #2563eb;">
            ${data.linkedIn ? `<span>${escapeHtml(data.linkedIn.replace(/^https?:\/\/(www\.)?/, ""))}</span>` : ""}
            ${data.portfolio ? `<span>${escapeHtml(data.portfolio.replace(/^https?:\/\/(www\.)?/, ""))}</span>` : ""}
          </div>
          `
              : ""
          }
        </div>

        <!-- Professional Summary -->
        ${
          data.summary
            ? `
        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 12px; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; margin-bottom: 12px;">
            Professional Summary
          </h2>
          <p style="font-size: 13px; color: #374151; line-height: 1.6; white-space: pre-wrap;">
            ${escapeHtml(data.summary)}
          </p>
        </div>
        `
            : ""
        }

        ${workExperienceHTML}
        ${educationHTML}
        ${skillsHTML}
        ${languagesHTML}
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = resumeSchema.parse(body);

    const html = generateResumeHTML(data);

    // Check if DocAPI key is available
    const apiKey = process.env.DOCAPI_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "PDF generation is not configured. Please set DOCAPI_KEY environment variable.",
        },
        { status: 500 }
      );
    }

    // Call DocAPI to generate PDF
    const pdfResponse = await fetch("https://api.docapi.co/v1/pdf", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "User-Agent": "DocAPI-ResumeBuilder/1.0",
        Accept: "application/pdf",
      },
      body: JSON.stringify({
        html,
        options: {
          format: "A4",
          margin: {
            top: "15mm",
            bottom: "15mm",
            left: "15mm",
            right: "15mm",
          },
          printBackground: true,
        },
      }),
    });

    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      console.error("DocAPI error:", errorText);
      return NextResponse.json(
        { error: "Failed to generate PDF" },
        { status: 500 }
      );
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    // Track successful generation (don't await to avoid slowing response)
    incrementStat("resumes_created").catch(() => {});

    const safeName = data.fullName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="resume-${safeName}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Resume generation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid resume data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}
