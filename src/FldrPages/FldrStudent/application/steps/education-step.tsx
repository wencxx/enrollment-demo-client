import type { UseFormReturn } from "react-hook-form"
import type { FormValues } from "@/FldrPages/FldrStudent/application/application"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EducationStepProps {
  form: UseFormReturn<FormValues>
}

export default function EducationStep({ form }: EducationStepProps) {
  const residentStatus = form.watch("residentStatus")

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Educational Background</h2>

      <Tabs defaultValue="previous" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="previous">Previous School</TabsTrigger>
          <TabsTrigger value="elementary">Elementary</TabsTrigger>
          <TabsTrigger value="highschool">High School</TabsTrigger>
          {residentStatus === "Transferee" && <TabsTrigger value="college">College</TabsTrigger>}
        </TabsList>

        <TabsContent value="previous" className="space-y-6 pt-4">
          <FormField
            control={form.control}
            name="schoolLastAttended"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Last Attended</FormLabel>
                <FormControl>
                  <Input placeholder="Enter school name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="previousSchoolAverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average on Previous School</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter average grade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="inclusionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inclusion Date</FormLabel>
                  <FormControl>
                    <Input placeholder="MM/YYYY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
                      <FormField
            control={form.control}
            name="section"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section</FormLabel>
                <FormControl>
                  <Input placeholder="Enter section" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>


        </TabsContent>

        <TabsContent value="elementary" className="space-y-6 pt-4">
          <FormField
            control={form.control}
            name="elementarySchoolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Elementary School Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter school name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="elementaryYearGraduated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Graduated</FormLabel>
                  <FormControl>
                    <Input placeholder="YYYY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="elementaryHonors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Honors Received</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter honors" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="highschool" className="space-y-6 pt-4">
          <FormField
            control={form.control}
            name="highSchoolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>High School Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter school name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="highSchoolYearGraduated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Graduated</FormLabel>
                  <FormControl>
                    <Input placeholder="YYYY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="highSchoolHonors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Honors Received</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter honors" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>

        {residentStatus === "Transferee" && (
          <TabsContent value="college" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="collegeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter college name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="collegeYearGraduated"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Graduated/Last Attended</FormLabel>
                    <FormControl>
                      <Input placeholder="YYYY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collegeHonors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Honors Received</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter honors" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

