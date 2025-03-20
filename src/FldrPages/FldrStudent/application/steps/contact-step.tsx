import type { UseFormReturn } from "react-hook-form"
import type { FormValues } from "@/FldrPages/FldrStudent/application/application"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface ContactStepProps {
  form: UseFormReturn<FormValues>
}

export default function ContactStep({ form }: ContactStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Contact Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="homeTelephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home Telephone</FormLabel>
              <FormControl>
                <Input placeholder="Enter home telephone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter mobile number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

