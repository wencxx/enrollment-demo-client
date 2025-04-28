"use client";
import { rateSchema } from "@/FldrSchema/userSchema.ts";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import axios from "axios";
import { useEffect, useState } from "react";
import { RateCourseCol } from "@/FldrTypes/ratecourse-col";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import { z } from "zod";
import { enrollment2Schema } from "@/FldrSchema/userSchema.ts";

type Enrollment2FormData = z.infer<typeof enrollment2Schema>;

type Enrollment2FormProps = {
  onSubmitSuccess: () => void;
  onAddRate: () => void;
};

type ComboOption = { label: string; value: string };

export function Enrollment2Form({ onSubmitSuccess, onAddRate }: Enrollment2FormProps) {
  const form = useForm<Enrollment2FormData>({
    resolver: zodResolver(
      z.object({
        pkCode: z.string().min(1, { message: "Select a student." }),
        rows: z
          .array(enrollment2Schema.omit({ pkCode: true }))
          .min(1, "At least one subject is required."),
      })
    ),
    defaultValues: {
      pkCode: "",
      rows: [
        {
          rowNum: 1,
          subjectCode: "",
          PKRate: "",
          professorCode: "",
          roomCode: "",
          scheduleDayCode: "",
          classStart: "",
          classEnd: "",
          noUnits: 0,
          rateAmount: 0,
          amount: 0,
          rateTypeCode: "",
        },
      ],
    },
    mode: "onChange",
  });

  const { control, handleSubmit, setValue, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rows",
  });

  const [students, setStudents] = useState<ComboOption[]>([]);
  const [subjects, setSubjects] = useState<ComboOption[]>([]);
  const [professors, setProfessors] = useState<ComboOption[]>([]);
  const [rooms, setRooms] = useState<ComboOption[]>([]);
  const [days, setDays] = useState<ComboOption[]>([]);
  


  // Fetch dropdown data
  useEffect(() => {
    async function fetchDropdowns() {
      try {
        const [studentsRes, subjectsRes, professorsRes, roomsRes, daysRes] = await Promise.all([
          axios.get(`${plsConnect()}/api/Enrollment2/ListEnrollment2Student`),
          axios.get(`${plsConnect()}/API/WebAPI/ListController/ListSubject`),
          axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListProfessor`),
          axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListRoom`),
          axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListDay`),
        ]);
        setStudents(studentsRes.data.map((s: any) => ({
          label: `${s.firstName} ${s.middleName} ${s.lastName} (${s.courseDesc} - ${s.yearDesc} - ${s.sectionDesc})`,
          value: s.pkCode,
        })));
        setSubjects(subjectsRes.data.map((s: any) => ({
          label: s.rdDesc,
          value: s.rdCode,
        })));
        setProfessors(professorsRes.data.map((p: any) => ({
          label: p.professorName,
          value: p.professorCode,
        })));
        setRooms(roomsRes.data.map((r: any) => ({
          label: r.roomDesc,
          value: r.roomCode,
        })));
        setDays(daysRes.data.map((d: any) => ({
          label: d.scheduleDayDesc,
          value: d.scheduleDayCode,
        })));
      } catch {
        toast("Error loading dropdowns");
      }
    }
    fetchDropdowns();
  }, []);

    // fetch NoUnits and RateAmount
    const rows = watch("rows");

    
//     useEffect(() => {
//       rows.forEach((row, idx) => {
//         if (row.subjectCode) {
//           axios
//             .get(`${plsConnect()}/api/Enrollment2/GetSubjectDetails/${row.subjectCode}`)
//             .then(res => {
//               setValue(`rows.${idx}.PKRate`, res.data.pkRate);
//               setValue(`rows.${idx}.noUnits`, res.data.noUnits);
//               setValue(`rows.${idx}.rateAmount`, res.data.rateAmount);
//               setValue(`rows.${idx}.amount`, res.data.noUnits === 0 ? res.data.rateAmount : res.data.noUnits * res.data.rateAmount
//               );

//           // Store rateTypeCode
//           setValue(`rows.${idx}.rateTypeCode`, res.data.rateTypeCode);
          
//           // Clear related fields if not a subject
//           if (res.data.rateTypeCode !== "1") {
//             setValue(`rows.${idx}.professorCode`, "00000");
//             setValue(`rows.${idx}.roomCode`, "000");
//             setValue(`rows.${idx}.scheduleDayCode`, "00");
//             setValue(`rows.${idx}.classStart`, "00:00");
//             setValue(`rows.${idx}.classEnd`, "00:00");
//           }
//         });
//     }
//   });
// }, [rows.map(r => r.subjectCode).join(",")]);

  const handleAddRow = () => {
    const nextRowNum =
      fields.length > 0 ? fields[fields.length - 1].rowNum + 1 : 1;
    append({
      rowNum: fields.length + 1,
      subjectCode: "",
      PKRate: "",
      professorCode: "",
      roomCode: "",
      scheduleDayCode: "",
      classStart: "",
      classEnd: "",
      noUnits: 0,
      rateAmount: 0,
      amount: 0,
      rateTypeCode: "",
    });
  };

  const handleRemoveRow = (index: number) => {
    remove(index);
  }
  useEffect(() => {
    // This runs after fields array has been properly updated by remove()
    fields.forEach((_, i) => {
      setValue(`rows.${i}.rowNum`, i + 1);
    });
  }, [fields, setValue]);


  const onSubmit = async (values: Enrollment2FormData) => {
    console.log("Original form values:", values);
    
    const PKRateValues = form.watch('rows').map(r => r.PKRate);
    console.log("PKRate values from form:", PKRateValues);
    
    // Create a new payload that with PKRAATE
    const payload = {
      pkCode: values.pkCode,
      rows: values.rows.map((row, index) => {
        // Get PKRate from form state
        const PKRate = form.getValues(`rows.${index}.PKRate`);
        console.log(`Row ${index} PKRate:`, PKRate);
        
        return {
          ...row,
          PKRate: PKRate || "" // Explicitly include PKRate from form state
        };
      })
    };
    
    console.log("Modified payload:", payload);

    if (payload.rows.some(row => !row.PKRate)) {
      toast("One or more subjects are missing PKRate. Please re-select the subject.");
      return;
    }
    
    try {
      await axios.post(
        `${plsConnect()}/api/Enrollment2/AddEnrollment2`,
        payload
      );
      onSubmitSuccess();
      onAddRate();
      toast("Enrollment submitted successfully.");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          toast.error("Entry already exists.")
        }
        else {
          const errorMessage = error.response?.data?.message || "Error submitting form."
          toast.error(errorMessage);
          console.error("API error:", error.response?.data)
        }
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="col-span-2">
            {/* STUDENT SELECTION */}
            <FormField
              control={form.control}
              name="pkCode"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  {/* <FormLabel>Rate Course</FormLabel> */}
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
                        ? students.find((s) => s.value === field.value)?.label
                        : "Select Student, course, year, and semester"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>None found.</CommandEmpty>
                          <CommandGroup>
                          {students.map((s) => (
                          <CommandItem
                          value={s.label}
                          key={s.value}
                          onSelect={() => {
                            setValue("pkCode", s.value);
                            field.onChange(s.value);
                          }}
                        >
                          {s.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              s.value === field.value
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
                <TableHead>Subject</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Class Start</TableHead>
                <TableHead>Class End</TableHead>
                <TableHead>No. of Units</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center"></TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
  {fields.map((item, index) => {
        const rateTypeCode = form.watch(`rows.${index}.rateTypeCode`);
        const isSubject = rateTypeCode === "1";

        return (
    <TableRow key={item.id}>
      {/* Subject */}
      <TableCell>
        <FormField
          control={form.control}
          name={`rows.${index}.subjectCode`}
          render={({ field }) => (
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
                      ? subjects.find((s) => s.value === field.value)?.label
                      : "Select Subject"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>None found.</CommandEmpty>
                    <CommandGroup>
                      {subjects.map((s) => (
                        <CommandItem
                          value={s.label}
                          key={s.value}
                          onSelect={async () => {
                            form.setValue(`rows.${index}.subjectCode`, s.value);
                            try {
                              const res = await axios.get(
                                `${plsConnect()}/api/Enrollment2/GetSubjectDetails/${s.value}`
                              );
                              form.setValue(`rows.${index}.PKRate`, res.data.pkRate);
                              form.setValue(`rows.${index}.noUnits`, res.data.noUnits);
                              form.setValue(`rows.${index}.rateAmount`, res.data.rateAmount);
                              form.setValue(`rows.${index}.amount`, 
                                res.data.noUnits === 0 ? res.data.rateAmount : res.data.noUnits * res.data.rateAmount
                              );
                              
                              // Store rateTypeCode
                              form.setValue(`rows.${index}.rateTypeCode`, res.data.rateTypeCode);
                              
                              // Clear related fields if not a subject
                              if (res.data.rateTypeCode !== "1") {
                                form.setValue(`rows.${index}.professorCode`, "00000");
                                form.setValue(`rows.${index}.roomCode`, "000");
                                form.setValue(`rows.${index}.scheduleDayCode`, "00");
                                form.setValue(`rows.${index}.classStart`, "00:00");
                                form.setValue(`rows.${index}.classEnd`, "00:00");
                              }
                            } catch {
                              toast("Failed to fetch subject details.");
                            }
                            field.onChange(s.value);
                          }}
                        >
                          {s.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              s.value === field.value
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
          )}
        />
      </TableCell>
      {/* Professor */}
      <TableCell>
        <FormField
          control={form.control}
          name={`rows.${index}.professorCode`}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={!isSubject}
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? professors.find((p) => p.value === field.value)?.label
                      : "Select Professor"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>None found.</CommandEmpty>
                    <CommandGroup>
                      {professors.map((p) => (
                        <CommandItem
                          value={p.label}
                          key={p.value}
                          onSelect={() => {
                            form.setValue(`rows.${index}.professorCode`, p.value);
                            field.onChange(p.value);
                          }}
                        >
                          {p.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              p.value === field.value
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
          )}
        />
      </TableCell>
      {/* Room */}
      <TableCell>
        <FormField
          control={form.control}
          name={`rows.${index}.roomCode`}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={!isSubject}
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? rooms.find((r) => r.value === field.value)?.label
                      : "Select Room"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>None found.</CommandEmpty>
                    <CommandGroup>
                      {rooms.map((r) => (
                        <CommandItem
                          value={r.label}
                          key={r.value}
                          onSelect={() => {
                            form.setValue(`rows.${index}.roomCode`, r.value);
                            field.onChange(r.value);
                          }}
                        >
                          {r.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              r.value === field.value
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
          )}
        />
      </TableCell>
      {/* Day */}
      <TableCell>
        <FormField
          control={form.control}
          name={`rows.${index}.scheduleDayCode`}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={!isSubject}
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? days.find((d) => d.value === field.value)?.label
                      : "Select Day"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>None found.</CommandEmpty>
                    <CommandGroup>
                      {days.map((d) => (
                        <CommandItem
                          value={d.label}
                          key={d.value}
                          onSelect={() => {
                            form.setValue(`rows.${index}.scheduleDayCode`, d.value);
                            field.onChange(d.value);
                          }}
                        >
                          {d.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              d.value === field.value
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
          )}
        />
      </TableCell>
{/* Class Start */}
<TableCell>
  <FormField
    control={form.control}
    name={`rows.${index}.classStart`}
    render={({ field }) => (
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              disabled={!isSubject}
              className={cn(
                "w-full justify-between",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value || "Select start time"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <p className="text-xs font-medium">Hour</p>
              <Select
                onValueChange={(hour) => {
                  const [_, minute, ampm] = (field.value || "12:00 AM").split(/[:\s]/);
                  field.onChange(`${hour}:${minute || "00"} ${ampm || "AM"}`);
                }}
                defaultValue={(field.value || "12:00 AM").split(/[:\s]/)[0] || "12"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={(i === 0 ? 12 : i).toString()}>
                      {(i === 0 ? 12 : i).toString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium">Minute</p>
              <Select
                onValueChange={(minute) => {
                  const [hour, _, ampm] = (field.value || "12:00 AM").split(/[:\s]/);
                  field.onChange(`${hour || "12"}:${minute} ${ampm || "AM"}`);
                }}
                defaultValue={(field.value || "12:00 AM").split(/[:\s]/)[1] || "00"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Minute" />
                </SelectTrigger>
                <SelectContent>
                  {["00", "15", "30", "45"].map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium">AM/PM</p>
              <Select
                onValueChange={(ampm) => {
                  const [hour, minute] = (field.value || "12:00 AM").split(/[:\s]/);
                  field.onChange(`${hour || "12"}:${minute || "00"} ${ampm}`);
                }}
                defaultValue={(field.value || "12:00 AM").split(/[:\s]/)[2] || "AM"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )}
  />
</TableCell>

{/* Class End - Same structure as Class Start */}
<TableCell>
  <FormField
    control={form.control}
    name={`rows.${index}.classEnd`}
    render={({ field }) => (
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              disabled={!isSubject}
              className={cn(
                "w-full justify-between",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value || "Select end time"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <p className="text-xs font-medium">Hour</p>
              <Select
                onValueChange={(hour) => {
                  const [_, minute, ampm] = (field.value || "12:00 AM").split(/[:\s]/);
                  field.onChange(`${hour}:${minute || "00"} ${ampm || "AM"}`);
                }}
                defaultValue={(field.value || "12:00 AM").split(/[:\s]/)[0] || "12"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={(i === 0 ? 12 : i).toString()}>
                      {(i === 0 ? 12 : i).toString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium">Minute</p>
              <Select
                onValueChange={(minute) => {
                  const [hour, _, ampm] = (field.value || "12:00 AM").split(/[:\s]/);
                  field.onChange(`${hour || "12"}:${minute} ${ampm || "AM"}`);
                }}
                defaultValue={(field.value || "12:00 AM").split(/[:\s]/)[1] || "00"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Minute" />
                </SelectTrigger>
                <SelectContent>
                  {["00", "15", "30", "45"].map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium">AM/PM</p>
              <Select
                onValueChange={(ampm) => {
                  const [hour, minute] = (field.value || "12:00 AM").split(/[:\s]/);
                  field.onChange(`${hour || "12"}:${minute || "00"} ${ampm}`);
                }}
                defaultValue={(field.value || "12:00 AM").split(/[:\s]/)[2] || "AM"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )}
  />
</TableCell>
      {/* No. of Units */}
      <TableCell>
        <FormField
          control={form.control}
          name={`rows.${index}.noUnits`}
          render={({ field }) => (
            <Input {...field} readOnly placeholder="Units" />
          )}
        />
      </TableCell>
      {/* Amount */}
      <TableCell>
        <FormField
          control={form.control}
          name={`rows.${index}.amount`}
          render={({ field }) => (
            <Input {...field} readOnly placeholder="Amount" />
          )}
        />
      </TableCell>

      {/* Remove Row */}
  <TableCell>
    <Button
      type="button"
      variant="ghost"
      onClick={() => handleRemoveRow(index)}
      className="text-red-500"
    >
      <Trash size={16} />
    </Button>
    
    {/* HIDDEN INPUTS */}
{/* PKRate */}
    <FormField
      control={form.control}
      name={`rows.${index}.PKRate`}
      render={({ field }) => (
        <input type="hidden" {...field} />
      )}
    />

    {/* RATETYPECODE */}
    <FormField
  control={form.control}
  name={`rows.${index}.rateTypeCode`}
  render={({ field }) => (
    <input type="hidden" {...field} />
  )}
/>
  </TableCell>
  
    </TableRow>
        );
      }
  )}
</TableBody>
          </Table>
          {/* <div className="border p-2 mt-4 bg-gray-100">
  <h4 className="font-bold">Debug Info:</h4>
  <p>PKRate values: {JSON.stringify(form.watch('rows').map(r => r.PKRate))}</p>
</div> */}

          <div className="col-span-2 flex justify-center">
            <Button
              type="button"
              onClick={handleAddRow}
              variant="ghost"
              className="w-full sm:w-10"
            >
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
  );
}
