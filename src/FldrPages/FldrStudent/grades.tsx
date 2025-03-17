import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { ArrowDown, ArrowUp, BarChart, BookOpen, GraduationCap } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for Philippine grading system
const academicData = {
  "2022-2023": {
    cumulativeGWA: 1.75, // General Weighted Average
    semesters: {
      semester1: {
        name: "First Semester 2022-2023",
        gwa: 1.8,
        gwaTrend: 0,
        units: 21,
        courses: 7,
        highestGrade: "1.00",
        highestCourse: "Filipino 1",
        lowestGrade: "2.50",
        lowestCourse: "Calculus 1",
        courseList: [
          { code: "FIL 101", title: "Filipino 1", units: 3, grade: "1.00", percentage: 96, remarks: "Passed" },
          {
            code: "ENG 101",
            title: "Communication Skills 1",
            units: 3,
            grade: "1.50",
            percentage: 92,
            remarks: "Passed",
          },
          { code: "MATH 101", title: "Calculus 1", units: 3, grade: "2.50", percentage: 80, remarks: "Passed" },
          {
            code: "CS 111",
            title: "Introduction to Computing",
            units: 3,
            grade: "1.75",
            percentage: 88,
            remarks: "Passed",
          },
          {
            code: "NSTP 1",
            title: "National Service Training Program 1",
            units: 3,
            grade: "1.25",
            percentage: 94,
            remarks: "Passed",
          },
          { code: "PE 1", title: "Physical Education 1", units: 3, grade: "2.00", percentage: 85, remarks: "Passed" },
          { code: "HIST 101", title: "Philippine History", units: 3, grade: "2.25", percentage: 82, remarks: "Passed" },
        ],
      },
      semester2: {
        name: "Second Semester 2022-2023",
        gwa: 1.7,
        gwaTrend: 0.1,
        units: 21,
        courses: 7,
        highestGrade: "1.00",
        highestCourse: "Computer Programming 1",
        lowestGrade: "2.25",
        lowestCourse: "Physics 1",
        courseList: [
          {
            code: "CS 121",
            title: "Computer Programming 1",
            units: 3,
            grade: "1.00",
            percentage: 97,
            remarks: "Passed",
          },
          { code: "MATH 102", title: "Calculus 2", units: 3, grade: "1.75", percentage: 88, remarks: "Passed" },
          { code: "PHYS 101", title: "Physics 1", units: 3, grade: "2.25", percentage: 82, remarks: "Passed" },
          { code: "FIL 102", title: "Filipino 2", units: 3, grade: "1.50", percentage: 92, remarks: "Passed" },
          {
            code: "ENG 102",
            title: "Communication Skills 2",
            units: 3,
            grade: "1.75",
            percentage: 88,
            remarks: "Passed",
          },
          {
            code: "NSTP 2",
            title: "National Service Training Program 2",
            units: 3,
            grade: "1.25",
            percentage: 94,
            remarks: "Passed",
          },
          { code: "PE 2", title: "Physical Education 2", units: 3, grade: "2.00", percentage: 85, remarks: "Passed" },
        ],
      },
      semester3: {
        name: "Second Semester 2022-2023",
        gwa: 1.7,
        gwaTrend: 0.1,
        units: 21,
        courses: 7,
        highestGrade: "1.00",
        highestCourse: "Computer Programming 1",
        lowestGrade: "2.25",
        lowestCourse: "Physics 1",
        courseList: [
          {
            code: "CS 121",
            title: "Computer Programming 1",
            units: 3,
            grade: "1.00",
            percentage: 97,
            remarks: "Passed",
          },
          { code: "MATH 102", title: "Calculus 2", units: 3, grade: "1.75", percentage: 88, remarks: "Passed" },
          { code: "PHYS 101", title: "Physics 1", units: 3, grade: "2.25", percentage: 82, remarks: "Passed" },
          { code: "FIL 102", title: "Filipino 2", units: 3, grade: "1.50", percentage: 92, remarks: "Passed" },
          {
            code: "ENG 102",
            title: "Communication Skills 2",
            units: 3,
            grade: "1.75",
            percentage: 88,
            remarks: "Passed",
          },
          {
            code: "NSTP 2",
            title: "National Service Training Program 2",
            units: 3,
            grade: "1.25",
            percentage: 94,
            remarks: "Passed",
          },
          { code: "PE 2", title: "Physical Education 2", units: 3, grade: "2.00", percentage: 85, remarks: "Passed" },
        ],
      },
    },
  },
  "2023-2024": {
    cumulativeGWA: 1.6,
    semesters: {
      semester1: {
        name: "First Semester 2023-2024",
        gwa: 1.65,
        gwaTrend: 0.05,
        units: 21,
        courses: 7,
        highestGrade: "1.00",
        highestCourse: "Data Structures and Algorithms",
        lowestGrade: "2.25",
        lowestCourse: "Discrete Mathematics",
        courseList: [
          {
            code: "CS 211",
            title: "Data Structures and Algorithms",
            units: 3,
            grade: "1.00",
            percentage: 96,
            remarks: "Passed",
          },
          {
            code: "CS 212",
            title: "Object-Oriented Programming",
            units: 3,
            grade: "1.25",
            percentage: 94,
            remarks: "Passed",
          },
          {
            code: "MATH 201",
            title: "Discrete Mathematics",
            units: 3,
            grade: "2.25",
            percentage: 82,
            remarks: "Passed",
          },
          { code: "PHYS 102", title: "Physics 2", units: 3, grade: "2.00", percentage: 85, remarks: "Passed" },
          { code: "SOC SCI", title: "Society and Culture", units: 3, grade: "1.50", percentage: 92, remarks: "Passed" },
          { code: "PE 3", title: "Physical Education 3", units: 3, grade: "1.75", percentage: 88, remarks: "Passed" },
          {
            code: "RIZAL",
            title: "Life and Works of Rizal",
            units: 3,
            grade: "1.75",
            percentage: 88,
            remarks: "Passed",
          },
        ],
      },
      semester2: {
        name: "Second Semester 2023-2024",
        gwa: 1.55,
        gwaTrend: 0.1,
        units: 21,
        courses: 7,
        highestGrade: "1.00",
        highestCourse: "Database Management Systems",
        lowestGrade: "2.00",
        lowestCourse: "Probability and Statistics",
        courseList: [
          {
            code: "CS 221",
            title: "Database Management Systems",
            units: 3,
            grade: "1.00",
            percentage: 97,
            remarks: "Passed",
          },
          { code: "CS 222", title: "Operating Systems", units: 3, grade: "1.25", percentage: 94, remarks: "Passed" },
          { code: "CS 223", title: "Web Development", units: 3, grade: "1.50", percentage: 92, remarks: "Passed" },
          {
            code: "MATH 202",
            title: "Probability and Statistics",
            units: 3,
            grade: "2.00",
            percentage: 85,
            remarks: "Passed",
          },
          { code: "ENG 201", title: "Technical Writing", units: 3, grade: "1.75", percentage: 88, remarks: "Passed" },
          { code: "PE 4", title: "Physical Education 4", units: 3, grade: "1.50", percentage: 92, remarks: "Passed" },
          { code: "HUM 101", title: "Art Appreciation", units: 3, grade: "1.75", percentage: 88, remarks: "Passed" },
        ],
      },
    },
  },
  "2024-2025": {
    cumulativeGWA: 1.5,
    semesters: {
      semester1: {
        name: "First Semester 2024-2025",
        gwa: 1.5,
        gwaTrend: 0.05,
        units: 21,
        courses: 7,
        highestGrade: "1.00",
        highestCourse: "Software Engineering",
        lowestGrade: "2.00",
        lowestCourse: "Computer Networks",
        courseList: [
          { code: "CS 311", title: "Software Engineering", units: 3, grade: "1.00", percentage: 96, remarks: "Passed" },
          { code: "CS 312", title: "Computer Networks", units: 3, grade: "2.00", percentage: 85, remarks: "Passed" },
          {
            code: "CS 313",
            title: "Artificial Intelligence",
            units: 3,
            grade: "1.25",
            percentage: 94,
            remarks: "Passed",
          },
          { code: "CS 314", title: "Mobile Development", units: 3, grade: "1.50", percentage: 92, remarks: "Passed" },
          { code: "CS 315", title: "Information Security", units: 3, grade: "1.75", percentage: 88, remarks: "Passed" },
          { code: "ETHICS", title: "Professional Ethics", units: 3, grade: "1.50", percentage: 92, remarks: "Passed" },
          { code: "ELEC 1", title: "Technical Elective 1", units: 3, grade: "1.75", percentage: 88, remarks: "Passed" },
        ],
      },
      semester2: {
        name: "Second Semester 2024-2025",
        gwa: 0,
        gwaTrend: 0,
        units: 18,
        courses: 6,
        highestGrade: "INC",
        highestCourse: "",
        lowestGrade: "INC",
        lowestCourse: "",
        courseList: [
          { code: "CS 321", title: "Machine Learning", units: 3, grade: "INC", percentage: 0, remarks: "In Progress" },
          { code: "CS 322", title: "Cloud Computing", units: 3, grade: "INC", percentage: 0, remarks: "In Progress" },
          { code: "CS 323", title: "Computer Graphics", units: 3, grade: "INC", percentage: 0, remarks: "In Progress" },
          {
            code: "CS 324",
            title: "Human-Computer Interaction",
            units: 3,
            grade: "INC",
            percentage: 0,
            remarks: "In Progress",
          },
          {
            code: "THESIS 1",
            title: "Undergraduate Thesis 1",
            units: 3,
            grade: "INC",
            percentage: 0,
            remarks: "In Progress",
          },
          {
            code: "ELEC 2",
            title: "Technical Elective 2",
            units: 3,
            grade: "INC",
            percentage: 0,
            remarks: "In Progress",
          },
        ],
      },
    },
  },
}

export default function Grades() {
  const [selectedYear, setSelectedYear] = useState("2023-2024")
  const yearData = academicData[selectedYear as keyof typeof academicData]

  return (
    <>
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Grade Report</h1>
          <p className="text-muted-foreground mt-1">Student Number: 0000001 | BS Information Technology</p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2022-2023">2022-2023</SelectItem>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
              <SelectItem value="2024-2025">2024-2025</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="text-sm font-medium">
            GWA: {yearData.cumulativeGWA.toFixed(2)}
          </Badge>
        </div>
      </header>

      <Tabs defaultValue="semester1" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8 w-full">
          <TabsTrigger value="semester1">First Semester</TabsTrigger>
          <TabsTrigger value="semester2">Second Semester</TabsTrigger>
          <TabsTrigger value="semester3">Third Semester</TabsTrigger>
        </TabsList>
    

        {Object.entries(yearData.semesters).map(([semesterId, semesterData]) => (
          <TabsContent key={semesterId} value={semesterId}>
            <SemesterSummary
              gwa={semesterData.gwa}
              gwaTrend={semesterData.gwaTrend}
              units={semesterData.units}
              courses={semesterData.courses}
              highestGrade={semesterData.highestGrade}
              highestCourse={semesterData.highestCourse}
              lowestGrade={semesterData.lowestGrade}
              lowestCourse={semesterData.lowestCourse}
            />
            <div className="rounded-md border mt-8">
              <Table>
                <TableCaption>{semesterData.name}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Course Code</TableHead>
                    <TableHead>Descriptive Title</TableHead>
                    <TableHead className="text-center">Units</TableHead>
                    <TableHead className="text-center">Final Grade</TableHead>
                    <TableHead className="text-center">Percentage</TableHead>
                    <TableHead className="text-center">Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {semesterData.courseList.map((course, index) => (
                    <CourseRow
                      key={index}
                      code={course.code}
                      title={course.title}
                      units={course.units}
                      grade={course.grade}
                      percentage={course.percentage}
                      remarks={course.remarks}
                    />
                  ))}
                  <TableRow className="font-medium bg-muted/50">
                    <TableCell colSpan={2} className="text-right">
                      Semester Total/Average:
                    </TableCell>
                    <TableCell className="text-center">{semesterData.units}</TableCell>
                    <TableCell className="text-center">
                      {semesterData.gwa > 0 ? semesterData.gwa.toFixed(2) : "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      {calculateAveragePercentage(semesterData.courseList) > 0
                        ? `${calculateAveragePercentage(semesterData.courseList).toFixed(1)}%`
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-center">{getMostCommonRemarks(semesterData.courseList)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <h3 className="font-semibold mb-2">Grading System Legend:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>1.00 - 1.25: Excellent (97-100%)</div>
                <div>1.50 - 1.75: Very Good (92-96%)</div>
                <div>2.00 - 2.25: Good (87-91%)</div>
                <div>2.50 - 2.75: Satisfactory (82-86%)</div>
                <div>3.00: Passing (75-81%)</div>
                <div>5.00: Failed (Below 75%)</div>
                <div>INC: Incomplete</div>
                <div>DRP: Dropped</div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}

function calculateAveragePercentage(courses: any[]): number {
  if (courses.length === 0 || courses.every((course) => course.percentage === 0)) return 0

  const totalPercentage = courses.reduce((sum, course) => sum + course.percentage, 0)
  return totalPercentage / courses.filter((course) => course.percentage > 0).length
}

function getMostCommonRemarks(courses: any[]): string {
  if (courses.length === 0) return "N/A"

  const remarksCounts: Record<string, number> = {}
  courses.forEach((course) => {
    remarksCounts[course.remarks] = (remarksCounts[course.remarks] || 0) + 1
  })

  let mostCommonRemarks = ""
  let highestCount = 0

  Object.entries(remarksCounts).forEach(([remarks, count]) => {
    if (count > highestCount) {
      mostCommonRemarks = remarks
      highestCount = count
    }
  })

  return mostCommonRemarks
}

interface SemesterSummaryProps {
  gwa: number
  gwaTrend: number
  units: number
  courses: number
  highestGrade: string
  highestCourse: string
  lowestGrade: string
  lowestCourse: string
}

function SemesterSummary({
  gwa,
  gwaTrend,
  units,
  courses,
  highestGrade,
  highestCourse,
  lowestGrade,
  lowestCourse,
}: SemesterSummaryProps) {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">GWA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{gwa > 0 ? gwa.toFixed(2) : "N/A"}</div>
          {gwa > 0 && (
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {gwaTrend > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{gwaTrend.toFixed(2)}</span>
                </>
              ) : gwaTrend < 0 ? (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{gwaTrend.toFixed(2)}</span>
                </>
              ) : (
                <span>No change</span>
              )}
              <span className="ml-1">from previous</span>
            </div>
          )}
          <Progress value={gwa > 0 ? ((5 - gwa) / 4) * 100 : 0} className="h-1 mt-3" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Units</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{units}</div>
          <p className="text-xs text-muted-foreground mt-1">{courses} courses</p>
          <Progress value={(units / 24) * 100} className="h-1 mt-3" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Highest Grade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{highestGrade}</div>
          <p className="text-xs text-muted-foreground mt-1">{highestCourse || "N/A"}</p>
          <Progress value={getGradePercentage(highestGrade)} className="h-1 mt-3" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Lowest Grade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowestGrade}</div>
          <p className="text-xs text-muted-foreground mt-1">{lowestCourse || "N/A"}</p>
          <Progress value={getGradePercentage(lowestGrade)} className="h-1 mt-3" />
        </CardContent>
      </Card>
    </div>
  )
}

interface CourseRowProps {
  code: string
  title: string
  units: number
  grade: string
  percentage: number
  remarks: string
}

function CourseRow({ code, title, units, grade, percentage, remarks }: CourseRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{code}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          {getCourseIcon(code)}
          <span>{title}</span>
        </div>
      </TableCell>
      <TableCell className="text-center">{units}</TableCell>
      <TableCell className="text-center">
        <Badge variant={getGradeBadgeVariant(grade)}>{grade}</Badge>
      </TableCell>
      <TableCell>
        {percentage > 0 ? (
          <div className="flex flex-col items-center">
            <span className="text-xs mb-1">{percentage}%</span>
            <Progress value={percentage} className="h-1 w-16" />
          </div>
        ) : (
          <span className="text-xs text-center text-muted-foreground">N/A</span>
        )}
      </TableCell>
      <TableCell className="text-center">
        <Badge
          variant="outline"
          className={`
            ${remarks === "Passed" ? "text-green-500 border-green-200 bg-green-50" : ""}
            ${remarks === "In Progress" ? "text-blue-500 border-blue-200 bg-blue-50" : ""}
            ${remarks === "Failed" ? "text-red-500 border-red-200 bg-red-50" : ""}
            ${remarks === "Incomplete" ? "text-yellow-500 border-yellow-200 bg-yellow-50" : ""}
            ${remarks === "Dropped" ? "text-gray-500 border-gray-200 bg-gray-50" : ""}
          `}
        >
          {remarks}
        </Badge>
      </TableCell>
    </TableRow>
  )
}

function getGradeBadgeVariant(grade: string): "default" | "secondary" | "outline" | "destructive" {
  if (grade === "1.00" || grade === "1.25") return "default"
  if (grade === "1.50" || grade === "1.75" || grade === "2.00" || grade === "2.25") return "secondary"
  if (grade === "2.50" || grade === "2.75" || grade === "3.00") return "outline"
  if (grade === "5.00") return "destructive"
  return "outline"
}

function getGradePercentage(grade: string): number {
  if (grade === "1.00") return 100
  if (grade === "1.25") return 97
  if (grade === "1.50") return 94
  if (grade === "1.75") return 91
  if (grade === "2.00") return 88
  if (grade === "2.25") return 85
  if (grade === "2.50") return 82
  if (grade === "2.75") return 79
  if (grade === "3.00") return 76
  if (grade === "5.00") return 50
  return 0
}

function getCourseIcon(code: string) {
  if (code.startsWith("CS")) return <BookOpen className="h-4 w-4 text-gray-500" />
  if (code.startsWith("MATH")) return <BarChart className="h-4 w-4 text-gray-500" />
  if (code.startsWith("PHYS")) return <BarChart className="h-4 w-4 text-gray-500" />
  return <GraduationCap className="h-4 w-4 text-gray-500" />
}

