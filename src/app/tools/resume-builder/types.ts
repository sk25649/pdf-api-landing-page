import { z } from "zod";

export const workExperienceSchema = z.object({
  id: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  isCurrentRole: z.boolean(),
  description: z.string(),
});

export const educationSchema = z.object({
  id: z.string(),
  degree: z.string(),
  school: z.string(),
  location: z.string(),
  graduationDate: z.string(),
  gpa: z.string().optional(),
});

export const languageSchema = z.object({
  id: z.string(),
  language: z.string(),
  proficiency: z.enum(["Native", "Fluent", "Advanced", "Intermediate", "Basic"]),
});

export const resumeSchema = z.object({
  // Personal Info
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string(),
  location: z.string(),
  linkedIn: z.string().optional(),
  portfolio: z.string().optional(),

  // Professional Summary
  summary: z.string(),

  // Work Experience
  workExperience: z.array(workExperienceSchema),

  // Education
  education: z.array(educationSchema),

  // Skills
  skills: z.string(),

  // Languages
  languages: z.array(languageSchema),
});

export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Language = z.infer<typeof languageSchema>;
export type ResumeFormData = z.infer<typeof resumeSchema>;

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function createEmptyWorkExperience(): WorkExperience {
  return {
    id: generateId(),
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrentRole: false,
    description: "",
  };
}

export function createEmptyEducation(): Education {
  return {
    id: generateId(),
    degree: "",
    school: "",
    location: "",
    graduationDate: "",
    gpa: "",
  };
}

export function createEmptyLanguage(): Language {
  return {
    id: generateId(),
    language: "",
    proficiency: "Intermediate",
  };
}

export const defaultResumeValues: ResumeFormData = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedIn: "",
  portfolio: "",
  summary: "",
  workExperience: [createEmptyWorkExperience()],
  education: [createEmptyEducation()],
  skills: "",
  languages: [],
};
