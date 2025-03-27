import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  // FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { RateType } from "@/FldrTypes/rate-type"
import { RateCourseCol } from "@/FldrTypes/ratecourse-col"
import { rateSchema } from "@/FldrSchema/userSchema";
import { Rate } from "@/FldrTypes/rate";


type RateFormData = z.infer<typeof rateSchema>;

interface RateFormProps {
  rateCode: string;
  onSubmitSuccess: (updatedRate: Rate) => void;
}

export function EditRate({ rateCode, onSubmitSuccess }: RateFormProps) {
const form = useForm<RateFormData>({
        resolver: zodResolver(rateSchema),
        defaultValues: {
          pkCode: "",
          rows: [],
        },
        mode: 'onChange',
      })

  const { control, handleSubmit, setError, clearErrors } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rows",
  });

  const [rateCourse, setRateCourse] = useState<RateCourseCol>({
    pkCode: '',
    yearDesc: '',
    semDesc: '',
    courseDesc: ''
  });
  const isFetchedRef = useRef(false);
  
  useEffect(() => {
    if (!rateCode || isFetchedRef.current) return;
  
    async function fetchData() {
      try {
        const rateCourseResponse = await axios.get(
          `${plsConnect()}/API/WEBAPI/ListController/ListSpecificRateCourse/${rateCode}`
        );
        const rateCourse = rateCourseResponse.data;
        setRateCourse(rateCourse);
  
        const rateDataResponse = await axios.get(
          `${plsConnect()}/API/WEBAPI/ListController/GetRate/${rateCode}`
        );
  
        form.reset({
          pkCode: rateCourse.pkCode,
          rows: rateDataResponse.data.map((row: any) => ({
            subjectCode: row.subjectCode,
            rateTypeCode: row.rateTypeCode,
            rateAmount: row.rateAmount.toString(),
            noUnits: row.noUnits.toString(),
            rowNum: row.rowNum,
          }))
        });

        isFetchedRef.current = true;
      } catch (error) {
        console.error("Error fetching data:", error);
        toast("Error fetching rate data or course.");
      }
    }
    fetchData();
  }, [rateCode, form]);

  const [rateType, setRateType] = useState<RateType[]>([])

  useEffect(() => {
    async function fetchRateType() {
      try {
        const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListRateType`) 
        setRateType(response.data) 
        } catch (error: any) {
            console.error("Error fetching rate types:", error)
        }
        }

        fetchRateType()
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
  };

  const validateSubjectCode = async (subjectCode: string) => {
    try {
      const response = await axios.get(
        `${plsConnect()}/API/WEBAPI/ListController/CheckSubjectCode/${subjectCode}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error validating subject code:", error);
      return false;
    }
  };

  const onSubmit = async (values: any) => {
    try {
      for (const row of values.rows) {
        // FOR CHECKING IF IT'S IN tblEntrySubject
        if (row.rateTypeCode === "1") {
          const isValid = await validateSubjectCode(row.subjectCode);
          if (!isValid) {
            setError(`rows.${row.rowNum - 1}.subjectCode`, {
              type: "manual",
              message: "Subject code does not exist.",
            });
            toast("Subject code does not exist.");
            return;
          } else {
            clearErrors(`rows.${row.rowNum - 1}.subjectCode`);
          }
        }
      }

      const updatedRateData = values.rows.map((row: any) => ({
        pkCode: values.pkCode,
        rateCode: rateCode,
        subjectCode: row.subjectCode,
        rateTypeCode: row.rateTypeCode,
        noUnits: parseInt(row.noUnits),
        rateAmount: parseFloat(row.rateAmount),
        rowNum: row.rowNum,
      }));

      await axios.put(`${plsConnect()}/API/WEBAPI/UpdateRate`, updatedRateData);
      onSubmitSuccess(updatedRateData);
      toast("Rate updated successfully.");
      console.log("sent:", updatedRateData); // no delete of existing rows yet, only update
    } catch (error) {
      console.error("Error updating rate:", error);
      toast("Error updating rate.");
    }
  };

return (
    <>
<Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">

        <div className="col-span-2">

            <FormField control={control}
            name="pkCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course, Year, and Semester</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="hidden"
                    value={rateCourse.pkCode}
                  />
                </FormControl>
              </FormItem>
              )}
            />
        </div>
        <div className="mt-2 text-white-400">
            {`${rateCourse.courseDesc} - ${rateCourse.yearDesc} - ${rateCourse.semDesc}`}
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
              {fields.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-right w-[100px]">
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
                  <TableCell className="text-right w-[100px]">
                    <FormField
                      control={control}
                      name={`rows[${index}].subjectCode`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Ex. ITPFL6" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="text-right w-[100px]">
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
                  <TableCell className="text-right w-[100px]">
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
              ))}
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