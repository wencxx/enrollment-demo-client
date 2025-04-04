import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formSchema } from "@/FldrSchema/application";
import { toast } from "sonner";
import useAuthStore from "@/FldrStore/auth";
import ResidentStatusStep from "@/FldrPages/FldrStudent/application/steps/resident-status-step"
import PersonalInfoStep from "@/FldrPages/FldrStudent/application/steps/personal-info-step"
import AddressStep from "@/FldrPages/FldrStudent/application/steps/address-step"
import ContactStep from "@/FldrPages/FldrStudent/application/steps/contact-step"
import ParentsStep from "@/FldrPages/FldrStudent/application/steps/parents-step"
import EducationStep from "@/FldrPages/FldrStudent/application/steps/education-step"

export type FormValues = z.infer<typeof formSchema>;

const stepFields: Record<number, (keyof FormValues)[]> = {
  1: ["residentStatus"],
  2: [
    "lastName",
    "firstName",
    "dateOfBirth",
    "placeOfBirth",
    "gender",
    "citizenship",
    "religion",
    "civilStatus",
    "bloodType",
  ],
  3: ["country", "province", "municipality", "barangay", "street"],
  4: ["mobileNumber"],
  5: ["motherName", "fatherName"],
  6: ["schoolLastAttended", "elementarySchoolName", "highSchoolName"],
};

export default function EnrollmentForm() {
  const { currentUser: user } = useAuthStore();
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      motherAlive: true,
      fatherAlive: true,
      motherAlumnus: false,
      fatherAlumnus: false,
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const createParentRecords = (data: FormValues) => {
    const parents = [];
    if (data.motherAlive) {
      parents.push({
        fullName: data.motherName,
        parentType: "Mother",
        deadOrAlive: true,
        alumnus: data.motherAlumnus || false,
        contactNumber: data.motherContact,
        emailAddress: data.motherEmail,
        education: data.motherEducation,
        occupation: data.motherOccupation,
        companyName: data.motherCompanyName,
        companyAddress: data.motherCompanyAddress,
        companyTelephone: data.motherCompanyTelephone,
        salary: data.motherSalary,
      });
    }
    if (data.fatherAlive) {
      parents.push({
        fullName: data.fatherName,
        parentType: "Father",
        deadOrAlive: true,
        alumnus: data.fatherAlumnus || false,
        contactNumber: data.fatherContact,
        emailAddress: data.fatherEmail,
        education: data.fatherEducation,
        occupation: data.fatherOccupation,
        companyName: data.fatherCompanyName,
        companyAddress: data.fatherCompanyAddress,
        companyTelephone: data.fatherCompanyTelephone,
        salary: data.fatherSalary,
      });
    }
    return parents;
  };

  const createEducationRecords = (data: FormValues) => {
    const educations = [];
    if (data.schoolLastAttended) {
      educations.push({
        SchoolLevel: "Previous",
        SchoolName: data.schoolLastAttended,
        Average: data.previousSchoolAverage,
        Section: data.section,
      });
    }
    if (data.elementarySchoolName) {
      educations.push({
        SchoolLevel: "Elementary",
        SchoolName: data.elementarySchoolName,
        AYGraduation: data.elementaryYearGraduated,
        HonorsReceived: data.elementaryHonors,
      });
    }
    if (data.highSchoolName) {
      educations.push({
        SchoolLevel: "HighSchool",
        SchoolName: data.highSchoolName,
        AYGraduation: data.highSchoolYearGraduated,
        HonorsReceived: data.highSchoolHonors,
      });
    }
    if (data.residentStatus === "Transferee" && data.collegeName) {
      educations.push({
        SchoolLevel: "College",
        SchoolName: data.collegeName,
        AYGraduation: data.collegeYearGraduated,
        HonorsReceived: data.collegeHonors,
        Section: data.section,
      });
    }
    return educations;
  };

  const onSubmit = async (data: FormValues) => {
    console.log("Form submission started!", data);
    try {
      setSubmitting(true);

      if (!user || !user.userCode) {
        toast.error("User is not logged in. Please log in to continue.");
        return;
      }

      const payload = {
        student: {
          studentCode: null,
          studentID: null,
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          suffix: data.suffix || null,
          gender: data.gender,
          residentStatus: data.residentStatus,
          birthDate: data.dateOfBirth.toISOString().split("T")[0],
          enrollStatusCode: null,
          enrollRemarks: null,
          userCode: user.userCode,
        },
        studentDetails: {
          studentDetailCode: null,
          studentCode: null,
          birthPlace: data.placeOfBirth,
          citizenship: data.citizenship,
          religion: data.religion,
          civilStatus: data.civilStatus,
          bloodType: data.bloodType,
          country: data.country,
          province: data.province,
          municipalityCity: data.municipality,
          barangay: data.barangay,
          streetAddress: data.street,
          homeTelephone: data.homeTelephone || null,
          mobileNum: data.mobileNumber,
        },
        parents: createParentRecords(data),
        educations: createEducationRecords(data),
      };

      console.log("Payload:", payload);

      const response = await axios.post(
        `${plsConnect()}/API/WebAPI/StudentController/SubmitStudentApplication`,
        payload
      );

      if (response.data.success) {
        toast.success("Application submitted successfully!");
      } else {
        toast.error(response.data.message || "Error submitting application");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = (step / totalSteps) * 100;

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
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                      Previous
                    </Button>
                  )}

                  {step < totalSteps ? (
                    <Button
                      type="button"
                      onClick={async () => {
                        const isValid = await form.trigger(stepFields[step]);
                        if (isValid) setStep(step + 1);
                        else toast.error("Please complete all required fields for this step.");
                      }}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={submitting}>
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
  );
}