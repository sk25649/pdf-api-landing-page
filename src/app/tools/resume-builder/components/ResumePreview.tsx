"use client";

import { ResumeFormData } from "../types";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

interface ResumePreviewProps {
  data: ResumeFormData;
}

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

export function ResumePreview({ data }: ResumePreviewProps) {
  const hasContactInfo = data.email || data.phone || data.location;
  const hasLinks = data.linkedIn || data.portfolio;
  const hasWorkExperience = data.workExperience.some(
    (exp) => exp.jobTitle || exp.company
  );
  const hasEducation = data.education.some((edu) => edu.degree || edu.school);
  const hasSkills = data.skills.trim().length > 0;
  const hasLanguages = data.languages.some((lang) => lang.language);

  return (
    <div
      className="bg-white shadow-lg w-full min-h-[500px]"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-3 mb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-1.5 tracking-wide">
            {data.fullName || "Your Name"}
          </h1>

          {/* Contact Row */}
          {hasContactInfo && (
            <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-gray-600 mb-1">
              {data.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {data.email}
                </span>
              )}
              {data.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {data.phone}
                </span>
              )}
              {data.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {data.location}
                </span>
              )}
            </div>
          )}

          {/* Links Row */}
          {hasLinks && (
            <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-blue-600">
              {data.linkedIn && (
                <span className="flex items-center gap-1">
                  <Linkedin className="h-3 w-3" />
                  {data.linkedIn.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              )}
              {data.portfolio && (
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {data.portfolio.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Professional Summary */}
        {data.summary && (
          <div className="mb-4">
            <h2 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
              {data.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {hasWorkExperience && (
          <div className="mb-4">
            <h2 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">
              Work Experience
            </h2>
            <div className="space-y-3">
              {data.workExperience
                .filter((exp) => exp.jobTitle || exp.company)
                .map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {exp.jobTitle || "Job Title"}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {exp.company}
                          {exp.location && ` | ${exp.location}`}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 text-right whitespace-nowrap">
                        {formatDate(exp.startDate)}
                        {exp.startDate && " - "}
                        {exp.isCurrentRole
                          ? "Present"
                          : formatDate(exp.endDate)}
                      </p>
                    </div>
                    {exp.description && (
                      <div className="mt-1.5 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Education */}
        {hasEducation && (
          <div className="mb-4">
            <h2 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">
              Education
            </h2>
            <div className="space-y-2">
              {data.education
                .filter((edu) => edu.degree || edu.school)
                .map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {edu.degree || "Degree"}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {edu.school}
                        {edu.location && ` | ${edu.location}`}
                        {edu.gpa && ` | GPA: ${edu.gpa}`}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(edu.graduationDate)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {hasSkills && (
          <div className="mb-4">
            <h2 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
                .map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {hasLanguages && (
          <div className="mb-4">
            <h2 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">
              Languages
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.languages
                .filter((lang) => lang.language)
                .map((lang) => (
                  <span key={lang.id} className="text-xs text-gray-700">
                    <span className="font-medium">{lang.language}</span>
                    <span className="text-gray-500"> - {lang.proficiency}</span>
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!data.fullName &&
          !data.summary &&
          !hasWorkExperience &&
          !hasEducation &&
          !hasSkills && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">
                Start filling out the form to see your resume preview
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
