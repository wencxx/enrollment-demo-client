import type { UseFormReturn } from "react-hook-form"
import type { FormValues } from "@/FldrPages/FldrStudent/application/application"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface ResidentStatusStepProps {
    form: UseFormReturn<FormValues>
}

export default function ResidentStatusStep({ form }: ResidentStatusStepProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Resident Status & Basic Information</h2>

            <FormField
                control={form.control}
                name="residentStatus"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Resident Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select resident status" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {/* <SelectItem value="Cross-Enrollee">Cross-Enrollee</SelectItem> */}
                                <SelectItem value="Freshman">Freshman</SelectItem>
                                <SelectItem value="Cross-Enrollee">Cross-Enrollee</SelectItem>
                                <SelectItem value="Returnee">Returnee</SelectItem>
                                <SelectItem value="Transferee">Transferee</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
{/* 
            <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Program</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter program" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="yearLevel"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Current Year Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select year level" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="1st Year">1st Year</SelectItem>
                                <SelectItem value="2nd Year">2nd Year</SelectItem>
                                <SelectItem value="3rd Year">3rd Year</SelectItem>
                                <SelectItem value="4th Year">4th Year</SelectItem>
                                <SelectItem value="5th Year">5th Year</SelectItem>
                                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            /> */}

            {/* <FormField
                control={form.control}
                name="lrn"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>LRN (Learner Reference Number)</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter LRN" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            /> */}
        </div>
    )
}

