import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import ResidentStatusStep from "@/FldrPages/FldrStudent/application/steps/resident-status-step"
import PersonalInfoStep from "@/FldrPages/FldrStudent/application/steps/personal-info-step"
import AddressStep from "@/FldrPages/FldrStudent/application/steps/address-step"
import ContactStep from "@/FldrPages/FldrStudent/application/steps/contact-step"
import ParentsStep from "@/FldrPages/FldrStudent/application/steps/parents-step"
import EducationStep from "@/FldrPages/FldrStudent/application/steps/education-step"
import { Progress } from "@/components/ui/progress"
import { formSchema } from "@/FldrSchema/application"
import { toast } from "sonner"

export type FormValues = z.infer<typeof formSchema>

export default function EnrollmentForm() {
  const [step, setStep] = useState(1)
  const totalSteps = 6
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      motherAlive: true,
      fatherAlive: true,
      motherAlumnus: false,
      fatherAlumnus: false,
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true)
      
      // Prepare student basic info
      const studentData = {
        FirstName: data.firstName,
        MiddleName: data.middleName,
        LastName: data.lastName,
        BirthDate: data.birthDate,
        Address: `${data.address || ''}`
      };
      
      // Prepare student details
      const studentDetails = {
        BirthPlace: data.birthPlace,
        Citizenship: data.citizenship,
        Religion: data.religion,
        CivilStatus: data.civilStatus,
        BloodType: data.bloodType,
        Country: data.country,
        Province: data.province,
        MunicipalityCity: data.municipalityCity,
        Barangay: data.barangay,
        StreetAddress: data.address,
        HomeTelephone: data.homeTelephone,
        MobileNum: data.mobileNum,
        ResidentStatus: data.residentStatus
      };
      
      // Prepare parent records
      const parentRecords = [];
      
      // Add mother record if mother is buhi
      if (data.motherAlive) {
        parentRecords.push({
          ParentType: "Mother",
          DeadOrAlive: true,
          Alumnus: data.motherAlumnus || false,
          ContactNumber: data.motherContact,
          EmailAddress: data.motherEmail,
          Education: data.motherEducation,
          Occupation: data.motherOccupation,
          CompanyName: data.motherCompanyName,
          CompanyAddress: data.motherCompanyAddress,
          CompanyTelephone: data.motherCompanyTelephone,
          Salary: data.motherSalary
        });
      }
      
      // Abuhirher buhir if buhir is buhi
      if (data.fatherAlive) {
        parentRecords.push({
          ParentType: "Father",
          DeadOrAlive: true,
          Alumnus: data.fatherAlumnus || false,
          ContactNumber: data.fatherContact,
          EmailAddress: data.fatherEmail,
          Education: data.fatherEducation,
          Occupation: data.fatherOccupation,
          CompanyName: data.fatherCompanyName,
          CompanyAddress: data.fatherCompanyAddress,
          CompanyTelephone: data.fatherCompanyTelephone,
          Salary: data.fatherSalary
        });
      }
      
      // Prepare education records
      const educationRecords = [];
      
      // Previous School record
      if (data.schoolLastAttended) {
        educationRecords.push({
          SchoolLevel: "Previous",
          SchoolName: data.schoolLastAttended,
          Average: data.previousSchoolAverage,
          InclusionDate: data.inclusionDate ? new Date(data.inclusionDate) : null,
          Section: data.section
        });
      }
      
      // Elementary Education
      if (data.elementarySchoolName) {
        educationRecords.push({
          SchoolLevel: "Elementary",
          SchoolName: data.elementarySchoolName,
          AYGraduation: data.elementaryYearGraduated,
          HonorsReceived: data.elementaryHonors,
        });
      }
      
      // High School Education
      if (data.highSchoolName) {
        educationRecords.push({
          SchoolLevel: "HighSchool",
          SchoolName: data.highSchoolName,
          AYGraduation: data.highSchoolYearGraduated,
          HonorsReceived: data.highSchoolHonors,
        });
      }
      
      // College Education (only for transferees)
      if (data.residentStatus === "Transferee" && data.collegeName) {
        educationRecords.push({
          SchoolLevel: "College",
          SchoolName: data.collegeName,
          AYGraduation: data.collegeYearGraduated,
          HonorsReceived: data.collegeHonors,
          Section: data.section
        });
      }
      
      // Create a complete student application object
      const studentApplication = {
        Student: studentData,
        StudentDetails: studentDetails,
        Parents: parentRecords,
        Educations: educationRecords
      };

      // Make a single API call with the complete application data
      const response = await axios.post(
        `${plsConnect()}/API/WEBAPI/StudentController/SubmitStudentApplication`, 
        studentApplication
      );
      
      if (response.data.success) {
        // Store the returned IDs if needed
        const { studentCode, studentID } = response.data.data;
        
        toast.success("Student application submitted successfully!");
        
        // Optional: Redirect the user or reset the form
        // router.push(`/student/confirmation/${studentID}`);
        // form.reset();
      } else {
        toast.error("Failed to submit application");
      }
      
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Error submitting application. Please check the console for details.");
    } finally {
      setSubmitting(false);
    }
  };
  
  const nextStep = () => {
    setStep(Math.min(step + 1, totalSteps))
  }

  const prevStep = () => {
    setStep(Math.max(step - 1, 1))
  }

  const progress = (step / totalSteps) * 100

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-8">Student Application Form</h1>
      <div className="max-w-4xl mx-auto">
        <Progress value={progress} className="mb-6" />
        <p className="text-center mb-6">
          Step {step} of {totalSteps}
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardContent className="pt-6">
                {step === 1 && <ResidentStatusStep form={form} />}
                {step === 2 && <PersonalInfoStep form={form} />}
                {step === 3 && <AddressStep form={form} />}
                {step === 4 && <ContactStep form={form} />}
                {step === 5 && <ParentsStep form={form} />}
                {step === 6 && <EducationStep form={form} />}

                <div className="flex justify-between mt-8">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {step < totalSteps ? (
                    <Button type="button" onClick={nextStep}>
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      disabled={submitting}
                      onClick={() => {
                        const values = form.getValues();
                        onSubmit(values);
                      }}
                    >
                      {submitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </>
  )
}