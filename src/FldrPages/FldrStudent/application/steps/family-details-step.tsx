import type { UseFormReturn } from "react-hook-form"
import type { FormValues } from "@/FldrPages/FldrStudent/application/application"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FamilyDetailsStepProps {
  form: UseFormReturn<FormValues>
}

export default function FamilyDetailsStep({ form }: FamilyDetailsStepProps) {
  const livingWith = form.watch("livingWith")

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Family Details</h2>

      <FormField
        control={form.control}
        name="livingWith"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Currently Living With</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select who you live with" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Parents">Parents</SelectItem>
                <SelectItem value="Mother">Mother</SelectItem>
                <SelectItem value="Father">Father</SelectItem>
                <SelectItem value="Guardian">Guardian</SelectItem>
                <SelectItem value="Alone">Alone</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {livingWith === "Guardian" && (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="guardianName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter guardian name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="guardianRelationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship to Guardian</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter relationship" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guardianContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guardian Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="numberOfSiblings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Siblings</FormLabel>
              <FormControl>
                <Input placeholder="Enter number" type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numberOfBrothers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Brothers</FormLabel>
              <FormControl>
                <Input placeholder="Enter number" type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numberOfSisters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Sisters</FormLabel>
              <FormControl>
                <Input placeholder="Enter number" type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

