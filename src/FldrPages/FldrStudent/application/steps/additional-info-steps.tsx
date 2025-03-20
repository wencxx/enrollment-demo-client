import type { UseFormReturn } from "react-hook-form"
import type { FormValues } from "@/FldrPages/FldrStudent/application/application"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

interface AdditionalInfoStepProps {
  form: UseFormReturn<FormValues>
}

export default function AdditionalInfoStep({ form }: AdditionalInfoStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Additional Information</h2>

      <FormField
        control={form.control}
        name="specialSkills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special Skills/Talents</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter your special skills or talents" className="min-h-[100px]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="handicapAilment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Handicap/Ailment (if any)</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter any handicap or ailment information" className="min-h-[100px]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

