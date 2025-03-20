import type React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FilterControlsProps {
  filters: {
    course: string
    section: string
    subject: string
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      course: string
      section: string
      subject: string
    }>
  >
  courses: string[]
  sections: string[]
}

export function FilterControls({ filters, setFilters, courses, sections }: FilterControlsProps) {
  const clearFilters = () => {
    setFilters({
      course: "",
      section: "",
      subject: "",
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="course-filter">Course</Label>
          <Select value={filters.course} onValueChange={(value) => setFilters({ ...filters, course: value })}>
            <SelectTrigger className="w-full" id="course-filter">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
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
              {sections.map((section) => (
                <SelectItem key={section} value={section}>
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject-filter">Subject</Label>
          <Select value={filters.subject} onValueChange={(value) => setFilters({ ...filters, subject: value })}>
            <SelectTrigger className="w-full" id="section-filter">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>All Subjects</SelectLabel>
                <SelectItem value="Computer Programming 1">Computer Programming 1</SelectItem>
                <SelectItem value="Database Management">Database Management</SelectItem>
                <SelectItem value="Mathematics in the Modern World">Mathematics in the Modern World</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(filters.course || filters.section || filters.subject) && (
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

