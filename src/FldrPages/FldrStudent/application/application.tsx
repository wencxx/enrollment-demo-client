import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import ResidentStatusStep from "@/FldrPages/FldrStudent/application/steps/resident-status-step"
import PersonalInfoStep from "@/FldrPages/FldrStudent/application/steps/personal-info-step"
import AddressStep from "@/FldrPages/FldrStudent/application/steps/address-step"
import ContactStep from "@/FldrPages/FldrStudent/application/steps/contact-step"
import ProgramDetailsStep from "@/FldrPages/FldrStudent/application/steps/program-details-step"
import ParentsStep from "@/FldrPages/FldrStudent/application/steps/parents-step"
import FamilyDetailsStep from "@/FldrPages/FldrStudent/application/steps/family-details-step"
import EducationStep  from "@/FldrPages/FldrStudent/application/steps/education-step"
import AdditionalInfoStep from "@/FldrPages/FldrStudent/application/steps/additional-info-steps"
import { Progress } from "@/components/ui/progress"
import { formSchema } from "@/FldrSchema/application"

export type FormValues = z.infer<typeof formSchema>

export default function EnrollmentForm() {
  const [step, setStep] = useState(1)
  const totalSteps = 9

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      residentStatus: "Freshmen",
      motherAlive: true,
      fatherAlive: true,
      motherAlumnus: false,
      fatherAlumnus: false,
      livingWith: "Parents",
    },
  })

  const onSubmit = (data: FormValues) => {
    console.log(data)
    alert("Form submitted successfully!")
  }

  const nextStep = () => {
    setStep(Math.min(step + 1, totalSteps))
  }

  const prevStep = () => {
    setStep(Math.max(step - 1, 1))
  }

  const progress = (step / totalSteps) * 100

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-8">Enrollment Application Form</h1>
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
                {step === 5 && <ProgramDetailsStep form={form} />}
                {step === 6 && <ParentsStep form={form} />}
                {step === 7 && <FamilyDetailsStep form={form} />}
                {step === 8 && <EducationStep form={form} />}
                {step === 9 && <AdditionalInfoStep form={form} />}

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
                    <Button type="submit">Submit Application</Button>
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

