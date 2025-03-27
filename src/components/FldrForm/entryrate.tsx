"use client"
import { rateSchema } from "@/FldrSchema/userSchema.ts"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { useEffect, useState } from "react"
import { RateCourseCol } from "@/FldrTypes/ratecourse-col"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Check, ChevronsUpDown, Plus, Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
  } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { RateType } from "@/FldrTypes/rate-type"
import { Input } from "../ui/input"
import { SubjectCol } from "@/FldrTypes/subject-prerequisite"

type RateFormData = z.infer<typeof rateSchema>

type RateFormProps = {
  onSubmitSuccess: () => void;
  onAddRate: () => void;
};

export function RateForm({ onSubmitSuccess, onAddRate }: RateFormProps) {
    const form = useForm<RateFormData>({
        resolver: zodResolver(rateSchema),
        defaultValues: {
          pkCode: "",
          rows: [
            {
              subjectCode: "",
              rateTypeCode: "",
              rateAmount: "",
              noUnits: "",
              rowNum: 1,
            },
          ],
        },
        mode: 'onChange',
      })

    const { control, handleSubmit, setValue, watch } = form;

    const { fields, append, remove } = useFieldArray({
      control,
      name: "rows",
    });

    const [rateCourse, setRateCourse] = useState<RateCourseCol[]>([])
    const [rateType, setRateType] = useState<RateType[]>([])
    const [subject, setSubject] = useState<SubjectCol[]>([])

    useEffect(() => {
      async function fetchData() {
        try {
          const rateCourseResponse = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListRateCourse`)
          const mappedRateCourseCode = rateCourseResponse.data.map((item: RateCourseCol) => ({
            label: `${item.courseDesc} - ${item.yearDesc} - ${item.semDesc}`,
            value: item.pkCode,
          }))
          setRateCourse(mappedRateCourseCode)

          const subjectResponse = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListSubject`)
          const mappedSubjectCode = subjectResponse.data.map((item: SubjectCol) => ({
            label: item.subjectDesc,
            value: item.subjectCode,
          }))
          setSubject(mappedSubjectCode)

          const rateTypeResponse = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListRateType`)
          setRateType(rateTypeResponse.data)
        } catch (error) {
          console.error("Error fetching data:", error)
          toast("Error fetching data.")
        }
      }
      fetchData()
    }, [])

  const handleAddRow = () => {
  const nextRowNum = fields.length > 0 ? fields[fields.length - 1].rowNum + 1 : 1;
    append({
      subjectCode: "",
      rateTypeCode: "",
      rateAmount: "",
      noUnits: "",
      rowNum: nextRowNum,
    });
  };

  const handleRemoveRow = (index: number) => {
    remove(index);
    fields.forEach((_, i) => {
      if (i !== index) {
        setValue(`rows[${i}].rowNum`, i + 1);
      }
    });
  };
  

  const onSubmit = async (values: any) => {
    
    const rateData = values.rows.map((row: any) => ({
      pkCode: values.pkCode,
      rateCode: "",
      subjectCode: row.subjectCode,
      rateTypeCode: row.rateTypeCode,
      noUnits: parseInt(row.noUnits),
      rateAmount: parseFloat(row.rateAmount),
      rowNum: row.rowNum,
    }));
    
      try {
        const response = await axios.post(`${plsConnect()}/API/WEBAPI/InsertEntry/InsertRate`, rateData)
        onSubmitSuccess()
        onAddRate()
        toast("Added new rate successfully.")
        console.log("Submitted:", rateData)
        console.log("Response:", response)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast("Error submitting form.")
        } else {
          console.error("Network error:", error)
          toast("Network error.")
        }
      }
    }

  return (
    <>
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">

        <div className="col-span-2">
        <FormField
          control={form.control}
          name="pkCode"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Rate Course</FormLabel>
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
                      {field.value
                        ? rateCourse.find(
                            (rateCourse) => rateCourse.value === field.value
                          )?.label
                        : "Select course, year, and semester"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>None found.</CommandEmpty>
                      <CommandGroup>
                        {rateCourse.map((rateCourse) => (
                          <CommandItem
                            value={rateCourse.label}
                            key={rateCourse.value}
                            onSelect={() => {
                                form.setValue("pkCode", rateCourse.value);
                                field.onChange(rateCourse.value);
                            }}
                          >
                            {rateCourse.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                rateCourse.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        </div>

        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rate Type</TableHead>
                <TableHead>Subject Code</TableHead>
                <TableHead>Number of Units</TableHead>
                <TableHead className="text-right">Rate Amount</TableHead>
                <TableHead className="text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((item, index) => {
                const selectedRateType = watch(`rows[${index}].rateTypeCode`);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="text-right w-[20%]">
                      <FormField
                        control={control}
                        name={`rows[${index}].rateTypeCode`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select rate type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {rateType.length > 0 ? (
                                    rateType.map((rateType) => (
                                      <SelectItem key={rateType.rateTypeCode} value={rateType.rateTypeCode}>
                                        {rateType.rateTypeDesc}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem disabled>No rate types available</SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-right w-[40%]">
                      <FormField
                        control={form.control}
                        name={`rows[${index}].subjectCode`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            {selectedRateType === "1" ? (
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
                                      {field.value
                                        ? subject.find(
                                            (subject) => subject.value === field.value
                                          )?.label
                                        : "Select subject"}
                                      <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                  <Command>
                                    <CommandInput
                                      placeholder="Search..."
                                      className="h-9"
                                    />
                                    <CommandList>
                                      <CommandEmpty>None found.</CommandEmpty>
                                      <CommandGroup>
                                        {subject.map((subject) => (
                                          <CommandItem
                                            value={subject.label}
                                            key={subject.value}
                                            onSelect={() => {
                                              form.setValue("subjectCode", subject.value);
                                              field.onChange(subject.value);
                                            }}
                                          >
                                            {subject.label}
                                            <Check
                                              className={cn(
                                                "ml-auto",
                                                subject.value === field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <FormControl>
                                <Input placeholder="Enter subject code" {...field} />
                              </FormControl>
                            )}
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-right w-[20%]">
                      <FormField
                        control={control}
                        name={`rows[${index}].noUnits`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Ex. 3" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-right w-[20%]">
                      <FormField
                        control={control}
                        name={`rows[${index}].rateAmount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Ex. 5000" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-center w-[50px]">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          handleRemoveRow(index);
                        }}
                        className="text-red-500"
                      >
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="col-span-2 flex justify-center">
            <Button type="button" onClick={handleAddRow} variant="ghost" className="w-full sm:w-10">
              <Plus />
            </Button>
          </div>

        <div className="col-span-2">
        <Button type="submit" className="w-full sm:w-20 float-right">
            Submit
        </Button>
        </div>
      </form>
    </Form>
    </>
  )
}
