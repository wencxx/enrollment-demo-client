import type React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FilterControlsProps {
  filters: {
    courseCode: string
    section: string
    subjectCode: string
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      courseCode: string
      section: string
      subjectCode: string
    }>
  >
  courses: {
    courseCode: string
    courseDesc: string
  }[]
  subjects: {
    subjectCode: string
    subjectDesc: string
  }[]
}

export function FilterControls({ filters, setFilters, courses, subjects }: FilterControlsProps) {
  const clearFilters = () => {
    setFilters({
      courseCode: "",
      section: "",
      subjectCode: "",
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="course-filter">Course</Label>
          <Select value={filters.courseCode} onValueChange={(value) => setFilters({ ...filters, courseCode: value })}>
            <SelectTrigger className="w-full" id="course-filter">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.courseCode} value={course.courseCode}>
                  {course.courseDesc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="section-filter">Section</Label>
          <Select value={filters.section} onValueChange={(value) => setFilters({ ...filters, section: value })}>
            <SelectTrigger className="w-full" id="section-filter">
              <SelectValue placeholder="All Sections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {['A', 'B', 'C', 'D'].map((section) => (
                <SelectItem key={section} value={section}>
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject-filter">Subject</Label>
          <Select value={filters.subjectCode} onValueChange={(value) => setFilters({ ...filters, subjectCode: value })}>
            <SelectTrigger className="w-full" id="subject-filter">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>All Subjects</SelectLabel>
                {subjects.map((subject) => (
                  <SelectItem key={subject.subjectCode} value={subject.subjectCode}>
                    {subject.subjectDesc}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(filters.courseCode || filters.section || filters.subjectCode) && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={clearFilters} className="flex items-center gap-1">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

