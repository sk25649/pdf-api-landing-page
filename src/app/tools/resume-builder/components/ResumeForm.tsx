"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  ResumeFormData,
  createEmptyWorkExperience,
  createEmptyEducation,
  createEmptyLanguage,
} from "../types";

interface ResumeFormProps {
  form: UseFormReturn<ResumeFormData>;
}

export function ResumeForm({ form }: ResumeFormProps) {
  const { register, control, watch, setValue } = form;

  const {
    fields: workFields,
    append: appendWork,
    remove: removeWork,
  } = useFieldArray({
    control,
    name: "workExperience",
  });

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: langFields,
    append: appendLang,
    remove: removeLang,
  } = useFieldArray({
    control,
    name: "languages",
  });

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                {...register("fullName")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                {...register("phone")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="San Francisco, CA"
                {...register("location")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedIn">LinkedIn URL</Label>
              <Input
                id="linkedIn"
                type="url"
                placeholder="https://linkedin.com/in/johndoe"
                {...register("linkedIn")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio / Website</Label>
              <Input
                id="portfolio"
                type="url"
                placeholder="https://johndoe.com"
                {...register("portfolio")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              placeholder="A brief 2-3 sentence overview of your professional background, key skills, and career goals..."
              rows={4}
              {...register("summary")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Work Experience</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendWork(createEmptyWorkExperience())}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {workFields.map((field, index) => (
            <div
              key={field.id}
              className="relative border rounded-lg p-4 space-y-4"
            >
              <div className="absolute -left-2 top-4 text-muted-foreground/50">
                <GripVertical className="h-4 w-4" />
              </div>

              {workFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                  onClick={() => removeWork(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    placeholder="Software Engineer"
                    {...register(`workExperience.${index}.jobTitle`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    placeholder="Acme Inc."
                    {...register(`workExperience.${index}.company`)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="San Francisco, CA"
                  {...register(`workExperience.${index}.location`)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    {...register(`workExperience.${index}.startDate`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <div className="space-y-2">
                    <Input
                      type="month"
                      disabled={watch(`workExperience.${index}.isCurrentRole`)}
                      {...register(`workExperience.${index}.endDate`)}
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={watch(`workExperience.${index}.isCurrentRole`)}
                        onChange={(e) => {
                          setValue(
                            `workExperience.${index}.isCurrentRole`,
                            e.target.checked
                          );
                          if (e.target.checked) {
                            setValue(`workExperience.${index}.endDate`, "");
                          }
                        }}
                      />
                      <span className="text-muted-foreground">
                        Currently working here
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description / Achievements</Label>
                <Textarea
                  placeholder="• Led development of key features&#10;• Improved performance by 40%&#10;• Mentored junior developers"
                  rows={4}
                  {...register(`workExperience.${index}.description`)}
                />
                <p className="text-xs text-muted-foreground">
                  Use bullet points (•) for better formatting
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Education</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendEdu(createEmptyEducation())}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {eduFields.map((field, index) => (
            <div
              key={field.id}
              className="relative border rounded-lg p-4 space-y-4"
            >
              <div className="absolute -left-2 top-4 text-muted-foreground/50">
                <GripVertical className="h-4 w-4" />
              </div>

              {eduFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                  onClick={() => removeEdu(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input
                    placeholder="Bachelor of Science in Computer Science"
                    {...register(`education.${index}.degree`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>School</Label>
                  <Input
                    placeholder="Stanford University"
                    {...register(`education.${index}.school`)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="Stanford, CA"
                    {...register(`education.${index}.location`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Graduation Date</Label>
                  <Input
                    type="month"
                    {...register(`education.${index}.graduationDate`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>GPA (optional)</Label>
                  <Input
                    placeholder="3.8 / 4.0"
                    {...register(`education.${index}.gpa`)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Textarea
              id="skills"
              placeholder="JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Git"
              rows={3}
              {...register("skills")}
            />
            <p className="text-xs text-muted-foreground">
              Separate skills with commas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Languages (optional)</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendLang(createEmptyLanguage())}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {langFields.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No languages added. Click &quot;Add&quot; to add a language.
            </p>
          ) : (
            langFields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-4"
              >
                <div className="flex-1 space-y-2">
                  <Label>Language</Label>
                  <Input
                    placeholder="English"
                    {...register(`languages.${index}.language`)}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Proficiency</Label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    {...register(`languages.${index}.proficiency`)}
                  >
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </select>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-6 text-muted-foreground hover:text-destructive"
                  onClick={() => removeLang(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
