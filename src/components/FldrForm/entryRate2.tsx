import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    // FormMessage,
    //   FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select"
import { useEffect, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown, Plus, Save, Trash } from "lucide-react";
import { Rate1Col, RateDescCol, RateSubTypeCol, RateTypeCol, } from "@/FldrTypes/kim-types";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { z } from "zod";
import { rateSchema } from "@/FldrSchema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";

type Rate2FormData = z.infer<typeof rateSchema>;

interface Rate2FormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function EntryRate2Form({ onCancel, onSuccess }: Rate2FormProps) {

    const form = useForm<Rate2FormData>({
        resolver: zodResolver(rateSchema),
        defaultValues: {
        pkRate1: "",
        rows: [
            {
            rdCode: "",
            rateTypeCode: "",
            perSem: "",
            rateAmount: "",
            academicUnits: "0",
            labUnits: "0",
            rateSubTypeCode: "",
            rateRowNum: 1,
            },
        ],
        },
        mode: 'onChange',
    })

    const { control, handleSubmit, setValue } = form;

    const watchedRows = useWatch({
        control,
        name: "rows",
        defaultValue: form.getValues("rows"),
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "rows",
    });

    useEffect(() => {
        watchedRows?.forEach((row, index) => {
            const academicUnits = parseInt(row.academicUnits || "0", 10) || 0;
            const labUnits = parseInt(row.labUnits || "0", 10) || 0;
            const perSem = parseInt(row.perSem || "0", 10) || 0;
            const totalUnits = academicUnits + labUnits;
            const rateAmount = perSem * totalUnits;
            // Only update if value is different to avoid unnecessary rerenders
            if (row.rateAmount !== rateAmount.toString()) {
                setValue(`rows.${index}.rateAmount`, rateAmount.toString());
            }
        });
    }, [watchedRows, setValue]);

    const [isLoading, setIsLoading] = useState(false);

    const [rateDesc, setRateDesc] = useState<RateDescCol[]>([])
    const [rateType, setRateType] = useState<RateTypeCol[]>([])
    const [rateSubType, setRateSubType] = useState<RateSubTypeCol[]>([])
    const [rate1, setRate1] = useState<Rate1Col[]>([])

    useEffect(() => {
            async function fetchData() {
            try {
                setIsLoading(true);
                const rateDescRes = await axios.get(`${plsConnect()}/API/WEBAPI/RateController/ListRateDesc`)
                const mappedRateDesc = rateDescRes.data.map((item: RateDescCol) => ({
                label: `${item.rdDesc}`,
                value: item.rdCode,
                }))
                setRateDesc(mappedRateDesc)
    
                const rateTypeRes = await axios.get(`${plsConnect()}/API/WEBAPI/RateController/ListRateType`)
                setRateType(rateTypeRes.data)

                const rateSubTypeRes = await axios.get(`${plsConnect()}/API/WEBAPI/RateController/ListRateSubType`)
                setRateSubType(rateSubTypeRes.data)

                const rate1Res = await axios.get(`${plsConnect()}/API/WEBAPI/RateController/ListRate1`)
                const mappedRate1 = rate1Res.data.map((item: Rate1Col) => ({
                label: `${item.courseDesc} - ${item.yearDesc} - ${item.semDesc}`,
                value: item.pkRate1,
                }))
                setRate1(mappedRate1)
                
            } catch (error) {
                console.error("Error fetching data:", error)
                toast("Error fetching data.")
            } finally {
                setIsLoading(false);
            }
            }
            fetchData()
        }, [])

    const handleAddRow = () => {
    const nextRowNum = fields.length > 0 ? fields[fields.length - 1].rateRowNum + 1 : 1;
        append({
        rdCode: "",
        rateTypeCode: "",
        rateSubTypeCode: "",
        rateAmount: "",
        academicUnits: "",
        labUnits: "",
        perSem: "",
        rateRowNum: nextRowNum,
        });
    };

    const handleRemoveRow = (index: number) => {
        remove(index);
        fields.forEach((_, i) => {
        if (i !== index) {
            setValue(`rows.${i}.rateRowNum`, i + 1);
        }
        });
  };

    const onSubmit = async (values: Rate2FormData) => {
        //tani gin buno nyo nlng ko
            const rate2Data = values.rows.map((row) => ({
            pkRate1: values.pkRate1,
            pkRate: "", //the actual primary key char(5)
            rdCode: row.rdCode,
            rateTypeCode: row.rateTypeCode,
            rateSubTypeCode: row.rateSubTypeCode,
            academicUnits: parseInt(row.academicUnits, 10),
            labUnits: parseInt(row.labUnits, 10),
            perSem: parseFloat(row.perSem),
            rateAmount: parseFloat(row.rateAmount),
            rateRowNum: row.rateRowNum,
            }));

        try {
            setIsLoading(true);

            console.log("Adding new rate2:", rate2Data);
            const response = await axios.post(`${plsConnect()}/API/WebAPI/RateController/InsertRate2`, rate2Data);
            toast("Rate2 added successfully.");
        
          console.log("API response:", response.data);
          form.reset();
          if (onSuccess) {
            onSuccess();
          }
          if (onCancel) {
            onCancel();
          }
        } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || "An error occurred.";
            if (error.response?.status === 409) {
            toast.error(errorMessage);
            } else {
            toast.error("An unexpected error occurred.");
            }
            console.error("API error:", error.response?.data);
        } else {
            console.error("Network error:", error);
            toast.error("Network error.");
        }
        } finally {
        setIsLoading(false);
        }
    };

return (
<>
    <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold">Add New Rate2</h2>
    </div>

    {/* to be revised */}
    <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">

        <div className="colspan-2">
            <FormField
            control={form.control}
            name="pkRate1"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Rate 1</FormLabel>
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
                            ? rate1.find(
                                (rate1) => rate1.value === field.value
                            )?.label
                            : "Select Rate 1"}
                        <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 min-w-[var(--radix-popover-trigger-width)]"
                    style={{ pointerEvents: "auto" }}>
                    <Command>
                        <CommandInput
                        placeholder="Search..."
                        className="h-9"
                        />
                        <CommandList>
                        <CommandEmpty>None found.</CommandEmpty>
                        <CommandGroup>
                            {rate1.map((rate1) => (
                            <CommandItem
                                value={rate1.label}
                                key={rate1.value}
                                onSelect={() => {
                                    form.setValue("pkRate1", rate1.value);
                                    field.onChange(rate1.value);
                                }}
                            >
                                {rate1.label}
                                <Check
                                className={cn(
                                    "ml-auto",
                                    rate1.value === field.value
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
                    <TableHead>Type</TableHead>
                    <TableHead>Subtype</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Academic</TableHead>
                    <TableHead>Laboratory</TableHead>
                    <TableHead>Total Units</TableHead>
                    <TableHead>Per Semester</TableHead>
                    <TableHead className="text-right">Rate Amount</TableHead>
                    <TableHead className="text-center"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {fields.map((item, index) => {
                    const academicUnits = watchedRows?.[index]?.academicUnits ?? "0";
                    const labUnits = watchedRows?.[index]?.labUnits ?? "0";
                    const totalUnits =
                    (parseInt(academicUnits || "0", 10) || 0) +
                    (parseInt(labUnits || "0", 10) || 0);

                    const perSem = watchedRows?.[index]?.perSem ?? "0";
                    const rateAmount =
                    (parseFloat(perSem || "0") || 0) * totalUnits;

                    // const selectedRateType = watch(`rows.${index}.rateTypeCode`);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="text-right w-[20%]">
                          <FormField
                            control={control}
                            name={`rows.${index}.rateTypeCode`}
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
                                        <SelectItem value="placeholder" disabled>No rate types available</SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-right w-[20%]">
                          <FormField
                            control={control}
                            name={`rows.${index}.rateSubTypeCode`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select rate subtype" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {rateSubType.length > 0 ? (
                                        rateSubType.map((rateSubType) => (
                                          <SelectItem key={rateSubType.rateSubTypeCode} value={rateSubType.rateSubTypeCode}>
                                            {rateSubType.rateSubTypeDesc}
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem value="placeholder" disabled>No rate subtypes available</SelectItem>
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
                            name={`rows.${index}.rdCode`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                {/* {selectedRateType === "1" ? ( */}
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
                                            ? rateDesc.find(
                                                (rateDesc) => rateDesc.value === field.value
                                              )?.label
                                            : "Select subject"}
                                          <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0"
                                    style={{ pointerEvents: "auto" }}>
                                      <Command>
                                        <CommandInput
                                          placeholder="Search..."
                                          className="h-9"
                                        />
                                        <CommandList>
                                          <CommandEmpty>None found.</CommandEmpty>
                                          <CommandGroup>
                                            {rateDesc.map((rateDesc) => (
                                              <CommandItem
                                                value={rateDesc.label}
                                                key={rateDesc.value}
                                                onSelect={() => {
                                                  form.setValue(`rows.${index}.rdCode`, rateDesc.value);
                                                  field.onChange(rateDesc.value);
                                                }}
                                              >
                                                {rateDesc.label}
                                                <Check
                                                  className={cn(
                                                    "ml-auto",
                                                    rateDesc.value === field.value
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
                                {/* ) : ( */}
                                  {/* <FormControl>
                                    <Input placeholder="Enter subject code" {...field} />
                                  </FormControl> */}
                                {/* )} */}
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-right w-[15%]">
                          <FormField
                            control={control}
                            name={`rows.${index}.academicUnits`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Units"
                                        min={0}
                                    />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-right w-[15%]">
                          <FormField
                            control={control}
                            name={`rows.${index}.labUnits`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Units"
                                        min={0}
                                    />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Input placeholder="Total" value={totalUnits} readOnly />
                        </TableCell>
                        <TableCell className="text-right w-[20%]">
                          <FormField
                            control={control}
                            name={`rows.${index}.perSem`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    placeholder="Ex. 50"
                                    min={1}
                                />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-right w-[20%]">
                          <FormField
                            control={control}
                            name={`rows.${index}.rateAmount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                    {/* calculate */}
                                  <Input
                                    {...field}
                                    readOnly
                                    value={rateAmount}
                                    placeholder="Total"
                                />
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
            <Button type="submit" disabled={isLoading} className="float-end">
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                <Save />
                Submit
                </span>
            )}
            </Button>
            </div>
          </form>
    </Form>

    {/* old */}
    {/* <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    
    <div className="colspan-2">
        <FormField
        control={form.control}
        name="pkRate1"
        render={({ field }) => (
            <FormItem className="flex flex-col">
            <FormLabel>Rate 1</FormLabel>
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
                        ? rate1.find(
                            (rate1) => rate1.value === field.value
                        )?.label
                        : "Select Rate 1"}
                    <ChevronsUpDown className="opacity-50" />
                    </Button>
                </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 min-w-[var(--radix-popover-trigger-width)]">
                <Command>
                    <CommandInput
                    placeholder="Search..."
                    className="h-9"
                    />
                    <CommandList>
                    <CommandEmpty>None found.</CommandEmpty>
                    <CommandGroup>
                        {rate1.map((rate1) => (
                        <CommandItem
                            value={rate1.label}
                            key={rate1.value}
                            onSelect={() => {
                                form.setValue("pkRate1", rate1.value);
                                field.onChange(rate1.value);
                            }}
                        >
                            {rate1.label}
                            <Check
                            className={cn(
                                "ml-auto",
                                rate1.value === field.value
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
    <div className="flex flex-wrap gap-4">
    <div className="flex-1 flex flex-col gap-y-4">
    <FormField
        control={form.control}
        name="rdCode"
        render={({ field }) => (
            <FormItem className="flex flex-col">
            <FormLabel>Rate Description</FormLabel>
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
                        ? rateDesc.find(
                            (rateDesc) => rateDesc.value === field.value
                        )?.label
                        : "Select rate description"}
                    <ChevronsUpDown className="opacity-50" />
                    </Button>
                </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 min-w-[var(--radix-popover-trigger-width)]">
                <Command>
                    <CommandInput
                    placeholder="Search..."
                    className="h-9"
                    />
                    <CommandList>
                    <CommandEmpty>None found.</CommandEmpty>
                    <CommandGroup>
                        {rateDesc.map((rateDesc) => (
                        <CommandItem
                            value={rateDesc.label}
                            key={rateDesc.value}
                            onSelect={() => {
                                form.setValue("rdCode", rateDesc.value);
                                field.onChange(rateDesc.value);
                            }}
                        >
                            {rateDesc.label}
                            <Check
                            className={cn(
                                "ml-auto",
                                rate1.value === field.value
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

<FormField
        control={form.control}
        name="rateTypeCode"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Rate Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select rate type" />
                </SelectTrigger>
                <SelectContent>
                    {rateType.map((item) => (
                    <SelectItem key={item.rateTypeCode} value={item.rateTypeCode}>
                        {item.rateTypeDesc}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            </FormItem>
        )}
        />
    </div>

    <div className="flex-1 flex flex-col gap-y-4">
    <FormField
            control={form.control}
            name="noUnits"
            render={({ field }) => (
            <FormItem>
                <FormLabel>No. of Units</FormLabel>
                <FormControl>
                <Input {...field}
                type="number"
                onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : parseInt(value));
                  }}
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="rateAmount"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Rate Amount</FormLabel>
                <FormControl>
                <Input {...field}
                type="number"
                onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : parseFloat(value));
                  }}
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        </div>
    </div>

        <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
            {isLoading ? (
            <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            </span>
            ) : ("Submit")}
        </Button>
        </div>
    </form>
    </Form> */}
</>
);
}
