import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Save, Users, GraduationCap } from "lucide-react"

// Sample data
const subjects = [
  { id: "math101", name: "Mathematics 101", code: "MATH101" },
  { id: "eng102", name: "English Literature", code: "ENG102" },
  { id: "sci103", name: "Physics", code: "SCI103" },
  { id: "hist104", name: "World History", code: "HIST104" },
]

const students = [
  {
    id: "1",
    name: "Alice Johnson",
    studentId: "2024001",
    section: "A",
    year: "1st Year",
    course: "Computer Science",
    grades: { math101: 85, eng102: 92, sci103: 78, hist104: 88 },
  },
  {
    id: "2",
    name: "Bob Smith",
    studentId: "2024002",
    section: "A",
    year: "1st Year",
    course: "Computer Science",
    grades: { math101: 78, eng102: 85, sci103: 82, hist104: 90 },
  },
  {
    id: "3",
    name: "Carol Davis",
    studentId: "2024003",
    section: "B",
    year: "1st Year",
    course: "Information Technology",
    grades: { math101: 92, eng102: 88, sci103: 85, hist104: 87 },
  },
  {
    id: "4",
    name: "David Wilson",
    studentId: "2024004",
    section: "A",
    year: "2nd Year",
    course: "Computer Science",
    grades: { math101: 88, eng102: 90, sci103: 92, hist104: 85 },
  },
  {
    id: "5",
    name: "Emma Brown",
    studentId: "2024005",
    section: "B",
    year: "2nd Year",
    course: "Information Technology",
    grades: { math101: 95, eng102: 87, sci103: 89, hist104: 93 },
  },
  {
    id: "6",
    name: "Frank Miller",
    studentId: "2024006",
    section: "A",
    year: "1st Year",
    course: "Engineering",
    grades: { math101: 82, eng102: 79, sci103: 94, hist104: 81 },
  },
  {
    id: "7",
    name: "Grace Lee",
    studentId: "2024007",
    section: "B",
    year: "1st Year",
    course: "Computer Science",
    grades: { math101: 90, eng102: 88, sci103: 85, hist104: 92 },
  },
  {
    id: "8",
    name: "Henry Clark",
    studentId: "2024008",
    section: "A",
    year: "2nd Year",
    course: "Engineering",
    grades: { math101: 87, eng102: 83, sci103: 96, hist104: 89 },
  },
]

export default function TeacherGradeManagement() {
  // Only one subject per teacher, use the first subject
  const subject = subjects[0]

  const [grades, setGrades] = useState(() => {
    const initialGrades: Record<string, number> = {}
    students.forEach((student) => {
      initialGrades[student.id] = student.grades[subject.id as keyof typeof student.grades] || 0
    })
    return initialGrades
  })

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600"
    if (grade >= 80) return "text-blue-600"
    if (grade >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getGradeBadge = (grade: number) => {
    if (grade >= 90)
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Excellent
        </Badge>
      )
    if (grade >= 80)
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          Good
        </Badge>
      )
    if (grade >= 70)
      return (
        <Badge variant="default" className="bg-yellow-100 text-yellow-800">
          Fair
        </Badge>
      )
    return <Badge variant="destructive">Needs Improvement</Badge>
  }

  // Group students by class (course + year + section)
  const groupStudentsByClass = () => {
    const classes: Record<string, typeof students> = {}

    students.forEach((student) => {
      const classKey = `${student.course} - ${student.year} - Section ${student.section}`
      if (!classes[classKey]) {
        classes[classKey] = []
      }
      classes[classKey].push(student)
    })

    // Sort students within each class by name
    Object.keys(classes).forEach((classKey) => {
      classes[classKey].sort((a, b) => a.name.localeCompare(b.name))
    })

    return classes
  }

  const classes = groupStudentsByClass()
  const classKeys = Object.keys(classes).sort()

  const [selectedClass, setSelectedClass] = useState(classKeys[0] || "")

  const handleGradeChange = (studentId: string, grade: string) => {
    const numericGrade = Math.max(0, Math.min(100, Number.parseInt(grade) || 0))
    setGrades((prev) => ({
      ...prev,
      [studentId]: numericGrade,
    }))
  }

  const StudentTable = ({ classStudents, className }: { classStudents: typeof students; className: string }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{className}</h3>
          <p className="text-sm text-muted-foreground">{classStudents.length} students enrolled</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{classStudents.length} students</Badge>
          <Badge variant="secondary">
            Avg:{" "}
            {Math.round(
              classStudents.reduce((sum, student) => sum + (grades[student.id] || 0), 0) / classStudents.length,
            )}
          </Badge>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.studentId}</TableCell>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={grades[student.id] || 0}
                  onChange={(e) => handleGradeChange(student.id, e.target.value)}
                  className={`w-20 ${getGradeColor(grades[student.id] || 0)}`}
                />
              </TableCell>
              <TableCell>{getGradeBadge(grades[student.id] || 0)}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Grade Management</h1>
          <p className="text-muted-foreground">Manage student grades by class sections</p>
        </div>
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save All Grades
        </Button>
      </div>

      {/* Subject Display (no selection) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Subject: {subject.code} - {subject.name}
          </CardTitle>
          <CardDescription>This is the subject you are assigned to manage grades for.</CardDescription>
        </CardHeader>
      </Card>

      {/* Class Lists */}
      <Card>
        <CardHeader>
          <CardTitle>Class Lists</CardTitle>
          <CardDescription>Select a class to view and manage student grades</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Class Selector */}
          <div className="flex items-center gap-4">
            <Label htmlFor="class">Select Class:</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[400px]">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classKeys.map((classKey) => (
                  <SelectItem key={classKey} value={classKey}>
                    {classKey}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Class Display */}
          {selectedClass && (
            <Card>
              <CardContent className="pt-6">
                <StudentTable classStudents={classes[selectedClass]} className={selectedClass} />
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classKeys.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(Object.values(grades).reduce((a, b) => a + b, 0) / Object.values(grades).length)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excellent (90+)</CardTitle>
            <Badge className="h-4 w-4 bg-green-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.values(grades).filter((grade) => grade >= 90).length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
