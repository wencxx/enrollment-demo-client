import type { UseFormReturn } from "react-hook-form"
import type { FormValues } from "@/FldrPages/FldrStudent/application/application"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProgramDetailsStepProps {
  form: UseFormReturn<FormValues>
}

export default function ProgramDetailsStep({ form }: ProgramDetailsStepProps) {
  const programInfluence = form.watch("programInfluence")
  const educationSupport = form.watch("educationSupport")

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Program Details</h2>

      <FormField
        control={form.control}
        name="firstChoiceProgram"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Choice Program</FormLabel>
            <FormControl>
              <Input placeholder="Enter first choice program" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="secondChoiceProgram"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Second Choice Program (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter second choice program" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormField
            control={form.control}
            name="programInfluence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Influence</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select influence" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Benefactor">Benefactor</SelectItem>
                    <SelectItem value="Friend">Friend</SelectItem>
                    <SelectItem value="Others">Others (specify)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {programInfluence === "Others" && (
            <FormField
              control={form.control}
              name="programInfluenceOther"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Specify Other Influence</FormLabel>
                  <FormControl>
                    <Input placeholder="Please specify" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div>
          <FormField
            control={form.control}
            name="educationSupport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education Support</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select support" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Scholarship">Scholarship</SelectItem>
                    <SelectItem value="Employed">Employed</SelectItem>
                    <SelectItem value="Relative">Relative</SelectItem>
                    <SelectItem value="Benefactor">Benefactor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {educationSupport === "Scholarship" && (
            <FormField
              control={form.control}
              name="typeOfScholarship"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Type of Scholarship</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter scholarship type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>
    </div>
  )
}

