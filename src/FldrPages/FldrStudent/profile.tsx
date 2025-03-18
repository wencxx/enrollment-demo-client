import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, GraduationCap, Home, Mail, MapPin, Phone } from "lucide-react"

export default function StudentProfile() {
  return (
    <>
        <div>
          <Card className="mb-6">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Current Enrollment Status</h3>
                  <p className="text-sm text-muted-foreground">Regular Student - 2nd Semester 2024-2025</p>
                </div>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600">Enrolled</Badge>
            </CardContent>
          </Card>

          <div className="mb-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-28 w-28 border-4 border-background">
              <AvatarImage src="/placeholder.svg?height=112&width=112" alt="Student" />
              <AvatarFallback>WB</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left space-y-2 flex-1">
              <h1 className="text-3xl font-bold">Wency Baterna</h1>
              <p className="text-muted-foreground">Information Technology Student</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Bacolod City, PH
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Home className="h-3 w-3" />
                  Student Number: 10045678
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">wncbtrn@chmsu.edu.ph</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">09638806212</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p>ECC Villas, Alijis</p>
                      <p>Bacolod City, PH 6100</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Degree</p>
                    <p className="text-sm text-muted-foreground">Bachelor of Science in Information Technology</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Academic Year</p>
                    <p className="text-sm text-muted-foreground">2024-2025</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Semester</p>
                    <p className="text-sm text-muted-foreground">1st semester</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Tabs defaultValue="education" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="subjects">Subjects</TabsTrigger>
                  <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
                </TabsList>

                {/* Education Tab */}
                <TabsContent value="education" className="space-y-6 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Education</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-medium">Bachelor of Science in Information Technology</h4>
                          <Badge variant="outline">Current</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          2021 - 2025 (Expected)
                        </div>
                        <p className="text-sm">Carlos Hilado Memorial State University</p>
                        <p className="text-sm text-muted-foreground">GPA: 3.85/4.0</p>
                        {/* for course major */}
                        {/* <div className="mt-2">
                          <p className="text-sm font-medium">Major</p>
                          <p className="text-sm text-muted-foreground">Artificial Intelligence and Machine Learning</p>
                        </div> */}
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-base font-medium">ICT - Computer System Services</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          2018 - 2020
                        </div>
                        <p className="text-sm">La Castellana National High School - SHS</p>
                        <p className="text-sm text-muted-foreground">GPA: 4.0/4.0</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-base font-medium">High School Diploma</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          2014 - 2018
                        </div>
                        <p className="text-sm">La Castellana National High School</p>
                        <p className="text-sm text-muted-foreground">GPA: 4.0/4.0</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Subjects Tab */}
                <TabsContent value="subjects" className="space-y-6 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Subjects</CardTitle>
                      <CardDescription>2nd Semester 2024-2025</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {[
                          { name: "Advanced Algorithms", code: "CS 401", progress: 75, units: 4 },
                          { name: "Machine Learning", code: "CS 456", progress: 60, units: 4 },
                          { name: "Web Development", code: "CS 380", progress: 85, units: 3 },
                          { name: "Database Systems", code: "CS 340", progress: 70, units: 3 },
                        ].map((course, index) => (
                          <li key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="text-sm font-medium">{course.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {course.code} • {course.units} units
                                </p>
                              </div>
                              <span className="text-sm">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Completed Subjects</CardTitle>
                      <CardDescription>Total units: 64</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {[
                          "Introduction to Programming",
                          "Data Structures",
                          "Computer Architecture",
                          "Operating Systems",
                          "Discrete Mathematics",
                          "Linear Algebra",
                          "Calculus I & II",
                          "Software Engineering",
                          "Computer Networks",
                          "Human-Computer Interaction",
                          "Technical Writing",
                          "Ethics in Computing",
                        ].map((course, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            {course}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Enrollment Tab */}
                <TabsContent value="enrollment" className="space-y-6 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Enrollment Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Status</p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-500 hover:bg-green-600">Enrolled</Badge>
                            <span className="text-sm text-muted-foreground">Regular Student</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Current Semester</p>
                          <p className="text-sm text-muted-foreground">2nd Semester 2024-2025</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Units This Semester</p>
                          <p className="text-sm text-muted-foreground">14 units</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Total Units Completed</p>
                          <p className="text-sm text-muted-foreground">64 / 120 Required</p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <h3 className="text-sm font-medium mb-2">Course Progress</h3>
                        <Progress value={53} className="h-2 mb-1" />
                        <p className="text-xs text-muted-foreground text-right">53% Complete</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Enrollment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { term: "1st semester - 2023-2024", status: "Completed", units: 16, gpa: 3.9 },
                          { term: "2nd semester - 2023-2024", status: "Completed", units: 15, gpa: 3.8 },
                          { term: "1st semester - 2024-2025", status: "Completed", units: 17, gpa: 3.75 },
                          { term: "2nd semester - 2024-2025", status: "Completed", units: 16, gpa: 3.9 },
                        ].map((term, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div>
                              <h4 className="font-medium">{term.term}</h4>
                              <p className="text-sm text-muted-foreground">
                                {term.units} units • GPA: {term.gpa}
                              </p>
                            </div>
                            <Badge variant="outline">{term.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
    </>
  )
}

