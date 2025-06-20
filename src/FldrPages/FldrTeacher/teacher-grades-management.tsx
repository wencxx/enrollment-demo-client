import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Save, Users, GraduationCap } from "lucide-react"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"

// --- New: Types for API data ---
type Professor = {
  professorCode: string;
  professorName: string;
};
type GradeRow = {
  gradeCode: string;
  pkedCode: string;
  yearDesc: string;
  courseDesc: string;
  semDesc: string;
  sectionDesc: string;
  ayStart: number;
  ayEnd: number;
  rdCode: string;
  rdDesc: string;
  professorName: string;
  studentID: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  midterm: number;
  final: number;
};

export default function TeacherGradeManagement() {
  // --- New: State for professors and grades ---
  const [professors, setProfessors] = useState<Professor[]>([])
  const [selectedProfessor, setSelectedProfessor] = useState<string>("")
  const [grades, setGrades] = useState<GradeRow[]>([])
  const [loadingProfessors, setLoadingProfessors] = useState(false)
  const [loadingGrades, setLoadingGrades] = useState(false)

  // --- New: State for selected subject ---
  const [selectedSubject, setSelectedSubject] = useState("")

  // --- New: State for subject assignments (pkedGroups) ---
  const [pkedGroups, setPkedGroups] = useState<any[]>([])

  // --- New: State for selected class ---
  const [selectedClass, setSelectedClass] = useState("")

  // --- New: State for confirmation dialog ---
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  // --- Add Grade Dialog State ---
  const [showAddGradeDialog, setShowAddGradeDialog] = useState(false);
  const [addGradeProfessor, setAddGradeProfessor] = useState("");
  const [addGradeClass, setAddGradeClass] = useState("");
  const [addGradeSubject, setAddGradeSubject] = useState("");
  const [addGradeStudent, setAddGradeStudent] = useState("");
  const [addGradeMidterm, setAddGradeMidterm] = useState(0);
  const [addGradeFinal, setAddGradeFinal] = useState(0);

  // Fetch professors on mount
  useEffect(() => {
    setLoadingProfessors(true)
    axios.get(plsConnect() + "/api/Professors")
      .then(res => setProfessors(res.data))
      .finally(() => setLoadingProfessors(false))
  }, [])

  // Fetch grades when professor, class, and subject are all selected
  useEffect(() => {
    if (!selectedProfessor || !selectedClass || !selectedSubject) return;
    setLoadingGrades(true);
    axios.get(
      plsConnect() + `/API/WebAPI/Grades/professor/${selectedProfessor}/pked/${selectedClass}/rdcode/${selectedSubject}`
    )
      .then(res => {
        setGrades(res.data)
      })
      .finally(() => setLoadingGrades(false));
  }, [selectedProfessor, selectedClass, selectedSubject])

  // Fetch pkedGroups when professor changes
  useEffect(() => {
    if (!selectedProfessor) return;
    setLoadingGrades(true);
    axios.get(plsConnect() + `/API/WebAPI/SubjectAssignment/${selectedProfessor}`)
      .then(res => {
        const data = res.data && res.data.length > 0 ? res.data[0].pkedGroups : [];
        setPkedGroups(data);
      })
      .finally(() => setLoadingGrades(false));
  }, [selectedProfessor]);

  // --- Class and Subject selection based on pkedGroups ---
  const classOptions = pkedGroups.map((group) => ({
    value: group.pkedCode,
    label: `${group.courseDesc} - ${group.yearDesc} - Section ${group.sectionDesc} (${group.ayStart}-${group.ayEnd}, ${group.semDesc})`,
    group
  }));

  const selectedPkedGroup = pkedGroups.find(g => g.pkedCode === selectedClass);
  const subjectOptions = selectedPkedGroup ? selectedPkedGroup.subjects.map((sub: any) => ({
    value: sub.rdCode,
    label: sub.rdDesc
  })) : [];

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

  const handleGradeChange = (gradeCode: string, type: 'midterm' | 'final', value: string) => {
    const numericGrade = Math.max(0, Math.min(100, Number.parseInt(value) || 0))
    setGrades((prev) => prev.map(row =>
      row.gradeCode === gradeCode ? { ...row, [type]: numericGrade } : row
    ))
  }

  const getAverage = (row: GradeRow) => Math.round((row.midterm + row.final) / 2)

  const StudentTable = ({ classStudents, className }: { classStudents: GradeRow[], className?: string }) => {
    // Find the class label from classOptions using className (which is pkedCode)
    const classLabel = classOptions.find(option => option.value === className)?.label || className;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            {className && <h3 className="text-lg font-semibold">{classLabel}</h3>}
            <p className="text-sm text-muted-foreground">{classStudents.length} students enrolled</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{classStudents.length} students</Badge>
            <Badge variant="secondary">
              Avg:{" "}
              {classStudents.length > 0 ? Math.round(
                classStudents.reduce((sum, row) => sum + getAverage(row), 0) / classStudents.length
              ) : 0}
            </Badge>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Midterm</TableHead>
              <TableHead>Final</TableHead>
              <TableHead>Average</TableHead>
              <TableHead>Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">No data available</TableCell>
              </TableRow>
            ) : (
              classStudents.map((row) => (
                <TableRow key={row.gradeCode}>
                  <TableCell className="font-medium">{row.studentID}</TableCell>
                  <TableCell className="font-medium">{`${row.lastName}, ${row.firstName} ${row.middleName} ${row.suffix}`}</TableCell>
                  <TableCell>{row.rdDesc}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={row.midterm}
                      onChange={(e) => handleGradeChange(row.gradeCode, 'midterm', e.target.value)}
                      className={`w-20 ${getGradeColor(row.midterm)}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={row.final}
                      onChange={(e) => handleGradeChange(row.gradeCode, 'final', e.target.value)}
                      className={`w-20 ${getGradeColor(row.final)}`}
                    />
                  </TableCell>
                  <TableCell className="font-bold">{getAverage(row)}</TableCell>
                  <TableCell>{getGradeBadge(getAverage(row))}</TableCell>
                </TableRow>
              )))
            }
          </TableBody>
        </Table>
      </div>
    )
  }

  // Remove filtering for now and just show all grades
  const filteredClassStudents = grades;

  // --- Filtered summary statistics ---
  const filteredGrades = filteredClassStudents;
  const filteredTotalStudents = filteredGrades.length;
  const filteredAverageGrade = filteredGrades.length > 0 ? Math.round(filteredGrades.reduce((a, b) => a + getAverage(b), 0) / filteredGrades.length) : 0;

  // --- Save All Grades function ---
  const handleSaveAllGrades = async () => {
    setSaving(true);
    try {
      const payload = grades.map(g => ({
        gradeCode: g.gradeCode,
        midterm: g.midterm,
        final: g.final
      }));
      await axios.put(plsConnect() + "/API/WebAPI/Grades", payload);
      toast.success("Success", { description: "Grades saved successfully!" });
    } catch (error) {
      toast.error("Error", { description: "Failed to save grades. Please try again." });
    } finally {
      setSaving(false);
      setShowConfirmDialog(false);
    }
  };

  // Function to add a new grade for a student
  const addGrade = async ({
    professorCode,
    pkedCode,
    rdCode,
    studentCode,
    midterm = 0,
    final = 0
  }: {
    professorCode: string;
    pkedCode: string;
    rdCode: string;
    studentCode: string;
    midterm?: number;
    final?: number;
  }) => {
    try {
      const payload = {
        professorCode,
        pkedCode,
        rdCode,
        studentCode,
        midterm,
        final
      };
      await axios.post(plsConnect() + "/API/WebAPI/Grades", payload);
      toast.success("Success", { description: "Grade added successfully!" });
    } catch (error) {
      toast.error("Error", { description: "Failed to add grade. Please try again." });
    }
  };

  // --- Add Grade Dialog Data State ---
  const [allAssignments, setAllAssignments] = useState<any[]>([]);

  // Fetch all subject assignments for Add Grade dialog
  useEffect(() => {
    axios.get(plsConnect() + "/API/WebAPI/SubjectAssignment/All")
      .then(res => setAllAssignments(res.data || []));
  }, []);

  // Get pkedGroups for selected professor in Add Grade dialog
  const addGradePkedGroups = allAssignments.find((p: any) => p.professorCode === addGradeProfessor)?.pkedGroups || [];
  // Get subjects and students for selected class in Add Grade dialog
  const addGradeSelectedPked = addGradePkedGroups.find((g: any) => g.pkedCode === addGradeClass);
  const addGradeSubjects = addGradeSelectedPked ? addGradeSelectedPked.subjects : [];
  let addGradeStudents = addGradeSelectedPked ? addGradeSelectedPked.students : [];
  // Filter out empty student objects
  addGradeStudents = addGradeStudents.filter((student: any) => student.studentCode && student.studentID && student.lastName);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Save</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to save all grades? This action cannot be undone.</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSaveAllGrades} disabled={saving}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Grade Dialog */}
      <Dialog open={showAddGradeDialog} onOpenChange={setShowAddGradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Grade</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Professor Selector */}
            <div className="flex items-center gap-4">
              <Label htmlFor="add-professor">Teacher:</Label>
              <Select value={addGradeProfessor} onValueChange={value => {
                setAddGradeProfessor(value);
                setAddGradeClass("");
                setAddGradeSubject("");
                setAddGradeStudent("");
              }}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {allAssignments.map((prof: any) => (
                    <SelectItem key={prof.professorCode} value={prof.professorCode}>
                      {prof.professorName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Class Selector (pkedCode) */}
            {addGradeProfessor && (
              <div className="flex items-center gap-4">
                <Label htmlFor="add-class">Class:</Label>
                <Select value={addGradeClass} onValueChange={value => {
                  setAddGradeClass(value);
                  setAddGradeSubject("");
                  setAddGradeStudent("");
                }}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {addGradePkedGroups.map((group: any) => (
                      <SelectItem key={group.pkedCode} value={group.pkedCode}>
                        {group.courseDesc} - {group.yearDesc} - Section {group.sectionDesc} ({group.ayStart}-{group.ayEnd}, {group.semDesc})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {/* Subject Selector */}
            {addGradeClass && (
              <div className="flex items-center gap-4">
                <Label htmlFor="add-subject">Subject:</Label>
                <Select value={addGradeSubject} onValueChange={setAddGradeSubject}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {addGradeSubjects.map((sub: any) => (
                      <SelectItem key={sub.rdCode} value={sub.rdCode}>{sub.rdDesc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {/* Student Selector */}
            {addGradeClass && (
              <div className="flex items-center gap-4">
                <Label htmlFor="add-student">Student:</Label>
                <Select value={addGradeStudent} onValueChange={setAddGradeStudent}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder={addGradeStudents.length === 0 ? 'No students available' : 'Select a student'} />
                  </SelectTrigger>
                  <SelectContent>
                    {addGradeStudents.length === 0 ? (
                      // Do not render a SelectItem with value="". Instead, just show nothing or a disabled message outside SelectItem.
                      <div className="px-4 py-2 text-muted-foreground">No students available</div>
                    ) : (
                      addGradeStudents.map((student: any) => (
                        <SelectItem key={student.studentCode} value={student.studentCode}>
                          {student.lastName}, {student.firstName} {student.middleName} {student.suffix} ({student.studentID})
                        </SelectItem>
                      )))
                    }
                  </SelectContent>
                </Select>
              </div>
            )}
            {/* Midterm and Final Inputs */}
            {addGradeClass && (
              <div className="flex items-center gap-4">
                <Label htmlFor="add-midterm">Midterm:</Label>
                <Input
                  id="add-midterm"
                  type="number"
                  min="0"
                  max="100"
                  value={addGradeMidterm}
                  onChange={e => setAddGradeMidterm(Number(e.target.value))}
                  className="w-24"
                />
                <Label htmlFor="add-final">Final:</Label>
                <Input
                  id="add-final"
                  type="number"
                  min="0"
                  max="100"
                  value={addGradeFinal}
                  onChange={e => setAddGradeFinal(Number(e.target.value))}
                  className="w-24"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddGradeDialog(false)}>Cancel</Button>
            <Button onClick={async () => {
              if (!addGradeProfessor || !addGradeClass || !addGradeSubject || !addGradeStudent) {
                toast.error("Error", { description: "Please select all fields." });
                return;
              }
              await addGrade({
                professorCode: addGradeProfessor,
                pkedCode: addGradeClass,
                rdCode: addGradeSubject,
                studentCode: addGradeStudent,
                midterm: addGradeMidterm,
                final: addGradeFinal
              });
              setShowAddGradeDialog(false);
              setAddGradeProfessor("");
              setAddGradeClass("");
              setAddGradeSubject("");
              setAddGradeStudent("");
              setAddGradeMidterm(0);
              setAddGradeFinal(0);
            }} disabled={!addGradeProfessor || !addGradeClass || !addGradeSubject || !addGradeStudent}>Add Grade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Grade Management</h1>
          <p className="text-muted-foreground">Registrar: Manage student grades by teacher and class sections</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2" onClick={() => setShowConfirmDialog(true)}>
            <Save className="h-4 w-4" />
            Save All Grades
          </Button>
          {/* Only keep this Add Grade button in the header */}
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowAddGradeDialog(true)}>
            <Save className="h-4 w-4" />
            Add Grade
          </Button>
        </div>
      </div>

      {/* Teacher Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Teacher</CardTitle>
          <CardDescription>Select a teacher to view and manage their grades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="teacher">Teacher:</Label>
            <Select value={selectedProfessor} onValueChange={setSelectedProfessor} disabled={loadingProfessors}>
              <SelectTrigger className="w-[400px]">
                <SelectValue placeholder={loadingProfessors ? "Loading..." : "Select a teacher"} />
              </SelectTrigger>
              <SelectContent>
                {professors.map((prof) => (
                  <SelectItem key={prof.professorCode} value={prof.professorCode}>
                    {prof.professorName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Class Lists */}
      {selectedProfessor && (
        <Card>
          <CardHeader>
            <CardTitle>Class Lists</CardTitle>
            <CardDescription>Select a class to view and manage student grades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Class Selector */}
            <div className="flex items-center gap-4">
              <Label htmlFor="class">Select Class:</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass} disabled={loadingGrades}>
                <SelectTrigger className="w-[400px]">
                  <SelectValue placeholder={loadingGrades ? "Loading..." : "Select a class"} />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Subject Selector */}
            {selectedClass && (
              <div className="flex items-center gap-4 mt-4">
                <Label htmlFor="subject">Select Subject:</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-[400px]">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectOptions.map((option: any) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {/* Selected Class Display */}
            {selectedClass && (
              <Card>
                <CardContent className="pt-6">
                  <StudentTable
                    classStudents={filteredClassStudents}
                    className={selectedClass}
                  />
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTotalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Midterm Grade</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredGrades.length > 0 ? Math.round(filteredGrades.reduce((a, b) => a + b.midterm, 0) / filteredGrades.length) : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Final Grade</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredGrades.length > 0 ? Math.round(filteredGrades.reduce((a, b) => a + b.final, 0) / filteredGrades.length) : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredAverageGrade}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
