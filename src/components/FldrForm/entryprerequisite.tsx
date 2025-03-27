import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { prerequisiteSchema } from "@/FldrSchema/userSchema.ts"
import { useEffect, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type PrerequisiteFormData = z.infer<typeof prerequisiteSchema>

type Subject = {
  SubjectCode: string;
  SubjectDesc: string;
  PrerequisiteCode?: string | null;
}

interface PrerequisiteFormProps {
  editMode?: boolean;
  subjectToEdit?: string;
  onCancel?: () => void;
}

export function PrerequisiteForm({ editMode = false, subjectToEdit = "", onCancel }: PrerequisiteFormProps) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [mappedSubjects, setMappedSubjects] = useState<{ label: string; value: string }[]>([])
  const [isEditing] = useState(editMode)
  const [selectedSubject, setSelectedSubject] = useState(subjectToEdit)

  const form = useForm<PrerequisiteFormData>({
    resolver: zodResolver(prerequisiteSchema),
    defaultValues: {
      subjectCode: "",
      prerequisiteCode: "",
    },
  })

  // Fetch all subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${plsConnect()}/API/WEBAPI/InsertEntry/GetSubjects`)
        
        // Ensure subjects have the expected structure
        const subjectsData = Array.isArray(response.data) 
          ? response.data.map((subject: any) => ({
              SubjectCode: subject.SubjectCode || subject.subjectCode,
              SubjectDesc: subject.SubjectDesc || subject.subjectDesc
            }))
          : [];
        
        setSubjects(subjectsData);
        
        // Map subjects for dropdown format
        const mapped = subjectsData.map((subject: Subject) => ({
          label: `${subject.SubjectCode} - ${subject.SubjectDesc}`,
          value: subject.SubjectCode
        }));
        
        setMappedSubjects(mapped);
      } catch (error) {
        console.error("Error fetching data:", error)
        toast("Error fetching data.")
      }
    }

    fetchSubjects()
  }, [])

  // If in edit mode and there's a subject to edit, fetch its details
  useEffect(() => {
    const fetchPrerequisiteDetails = async () => {
      if (isEditing && selectedSubject) {
        try {
          const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/GetPrerequisite/${selectedSubject}`)
          form.setValue("subjectCode", response.data.SubjectCode || response.data.subjectCode)
          form.setValue("prerequisiteCode", response.data.PrerequisiteCode || response.data.prerequisiteCode)
        } catch (error) {
          console.error("Error fetching prerequisite details:", error)
          toast("Error fetching prerequisite details.")
        }
      }
    }

    if (isEditing && selectedSubject) {
      fetchPrerequisiteDetails()
    }
  }, [isEditing, selectedSubject, form])

  const onSubmit = async (values: PrerequisiteFormData) => {
    // Validate that subject and prerequisite are not the same
    if (values.subjectCode === values.prerequisiteCode) {
      toast.error("Subject and prerequisite cannot be the same.");
      return;
    }
    
    try {
      let response;
      if (isEditing) {
        response = await axios.put(`${plsConnect()}/API/WEBAPI/UpdateEntry/UpdatePrerequisite`, values)
        toast("Prerequisite updated successfully.")
      } else {
        response = await axios.post(`${plsConnect()}/API/WEBAPI/InsertEntry/InsertPrerequisite`, values)
        toast("Prerequisite added successfully.")
      }
      
      console.log("Data submitted successfully:", response.data)
      form.reset()
      
      if (onCancel) {
        onCancel()
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Error submitting form.";
        console.error("API error:", error.response?.data);
        toast(errorMessage)
      } else {
        console.error("Network error:", error)
        toast("Network error.")
      }
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{isEditing ? "Edit Prerequisite" : "Add New Prerequisite"}</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="subjectCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject Code</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={isEditing}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value && mappedSubjects.length > 0
                          ? mappedSubjects.find(
                              (subject) => subject.value === field.value
                            )?.label || "Select a subject"
                          : "Select a subject"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search subject..." />
                      <CommandList>
                        <CommandEmpty>No subject found.</CommandEmpty>
                        <CommandGroup>
                          {mappedSubjects.map((subject) => (
                            <CommandItem
                              key={subject.value}
                              value={subject.label}
                              onSelect={() => {
                                form.setValue("subjectCode", subject.value);
                                field.onChange(subject.value);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  subject.value === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {subject.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prerequisiteCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prerequisite Code</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value && mappedSubjects.length > 0
                          ? mappedSubjects.find(
                              (subject) => subject.value === field.value
                            )?.label || "Select a prerequisite"
                          : "Select a prerequisite"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search prerequisite..." />
                      <CommandList>
                        <CommandEmpty>No prerequisite found.</CommandEmpty>
                        <CommandGroup>
                          {mappedSubjects.map((subject) => (
                            <CommandItem
                              key={subject.value}
                              value={subject.label}
                              onSelect={() => {
                                form.setValue("prerequisiteCode", subject.value);
                                field.onChange(subject.value);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  subject.value === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {subject.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            {isEditing && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">
              {isEditing ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}