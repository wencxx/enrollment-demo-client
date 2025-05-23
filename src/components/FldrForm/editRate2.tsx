import { useForm, useWatch } from "react-hook-form";
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
import { Check, ChevronsUpDown, Save } from "lucide-react";
import { Rate1Col, RateDescCol, RateSubTypeCol, RateTypeCol, } from "@/FldrTypes/kim-types";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { z } from "zod";
import { editRate2Schema } from "@/FldrSchema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";

type Rate2FormData = z.infer<typeof editRate2Schema>;

interface Rate2FormProps {
    pkRate: string;
    onCancel?: () => void;
    onSuccess?: () => void;
}

export function EditRate2Form({ pkRate, onCancel, onSuccess }: Rate2FormProps) {

    const form = useForm<Rate2FormData>({
        resolver: zodResolver(editRate2Schema),
            defaultValues: {
            pkRate1: "",
            rdCode: "",
            rateTypeCode: "",
            rateSubTypeCode: "",
            perSem: 0,
            noUnits: 0,
            rateAmount: 0,
        },
        mode: 'onChange',
    })

    const { control, handleSubmit, setValue } = form;

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
                const mappedRateType = rateTypeRes.data.map((item: RateTypeCol) => ({
                label: `${item.rateTypeDesc}`,
                value: item.rateTypeCode,
                }))
                setRateType(mappedRateType)

                const rateSubTypeRes = await axios.get(`${plsConnect()}/API/WEBAPI/RateController/ListRateSubType`)
                const mappedRateSubType = rateSubTypeRes.data.map((item: RateSubTypeCol) => ({
                label: `${item.rateSubTypeDesc}`,
                value: item.rateSubTypeCode,
                }))
                setRateSubType(mappedRateSubType)

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

        useEffect(() => {
            async function fetchEditData() {
                try {
                setIsLoading(true);
                const res = await axios.get(`${plsConnect()}/API/WebAPI/RateController/GetRate2/${pkRate}`);
                const data = res.data;

                form.reset({
                    pkRate1: data.pkRate1 || "",
                    rdCode: data.rdCode || "",
                    rateTypeCode: data.rateTypeCode || "",
                    rateSubTypeCode: data.rateSubTypeCode || "",
                    perSem: data.perSem?.toString() || "",
                    noUnits: data.noUnits?.toString() || "",
                    rateAmount: Number(data.perSem || 0) * Number(data.noUnits || 0),
                });
                console.log("fetched", data)

                } catch (err) {
                console.error("Error loading data", err);
                toast.error("Failed to load Rate2 details.");
                } finally {
                setIsLoading(false);
                }
            }

            if (pkRate) fetchEditData();
            }, [pkRate]);

    const watchedNoUnits = useWatch({ control, name: "noUnits" });
    const watchedPerSem = useWatch({ control, name: "perSem" });
    const computedRateAmount = watchedNoUnits * watchedPerSem;

    const onSubmit = async (values: Rate2FormData) => {
        try {
        setIsLoading(true);

            const payload = {
                pkRate1: values.pkRate1,
                rdCode: values.rdCode,
                rateTypeCode: values.rateTypeCode,
                rateSubTypeCode: values.rateSubTypeCode,
                perSem: values.perSem,
                noUnits: values.noUnits,
                rateAmount: computedRateAmount,
            };

            const response = await axios.put(`${plsConnect()}/API/WebAPI/RateController/UpdateRate2/${pkRate}`, payload);
            toast.success("Rate2 updated successfully!");
            console.log("values:", payload)
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
  
          <Table className="min-w-[800px]">
            <TableHeader>
                <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Subtype</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Per Semester</TableHead>
                <TableHead className="text-right">Rate Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                <TableCell className="text-right w-[20%]">
                    <FormField
                        control={form.control}
                        name="rateTypeCode"
                        render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between btn-disabled-black",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    // disabled
                                    >
                                    {field.value
                                        ? rateType.find(
                                            (rateType) => rateType.value === field.value
                                        )?.label
                                        : "Select college"}
                                    <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0 min-w-[var(--radix-popover-trigger-width)]"
                                style={{ pointerEvents: "auto" }}>
                                <Command>
                                    <CommandList>
                                    <CommandEmpty>None found.</CommandEmpty>
                                    <CommandGroup>
                                        {rateType.map((rateType) => (
                                        <CommandItem
                                            value={rateType.label}
                                            key={rateType.value}
                                            onSelect={() => {
                                            form.setValue("rateTypeCode", rateType.value);
                                            field.onChange(rateType.value);
                                            }}
                                        >
                                            {rateType.label}
                                            <Check
                                            className={cn(
                                                "ml-auto",
                                                rateType.value === field.value
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
                </TableCell>

                <TableCell className="text-right w-[20%]">
                    <FormField
                        control={form.control}
                        name="rateSubTypeCode"
                        render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between btn-disabled-black",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    // disabled
                                    >
                                    {field.value
                                        ? rateSubType.find(
                                            (rateSubType) => rateSubType.value === field.value
                                        )?.label
                                        : "Select subtype"}
                                    <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0 min-w-[var(--radix-popover-trigger-width)]"
                                style={{ pointerEvents: "auto" }}>
                                <Command>
                                    <CommandList>
                                    <CommandEmpty>None found.</CommandEmpty>
                                    <CommandGroup>
                                        {rateSubType.map((rateSubType) => (
                                        <CommandItem
                                            value={rateSubType.label}
                                            key={rateSubType.value}
                                            onSelect={() => {
                                            form.setValue("rateSubTypeCode", rateSubType.value);
                                            field.onChange(rateSubType.value);
                                            }}
                                        >
                                            {rateSubType.label}
                                            <Check
                                            className={cn(
                                                "ml-auto",
                                                rateType.value === field.value
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
                </TableCell>

                <TableCell className="text-right w-[40%]">
                    <FormField
                    control={control}
                    name="rdCode"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
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
                                    ? rateDesc.find((rd) => rd.value === field.value)?.label
                                    : "Select subject"}
                                <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 min-w-[var(--radix-popover-trigger-width)]"
                            style={{ pointerEvents: "auto" }}>
                            <Command>
                                <CommandInput placeholder="Search..." className="h-9" />
                                <CommandList>
                                <CommandEmpty>None found.</CommandEmpty>
                                <CommandGroup>
                                    {rateDesc.map((rd) => (
                                    <CommandItem
                                        value={rd.label}
                                        key={rd.value}
                                        onSelect={() => {
                                        setValue("rdCode", rd.value);
                                        field.onChange(rd.value);
                                        }}
                                    >
                                        {rd.label}
                                        <Check
                                        className={cn(
                                            "ml-auto",
                                            rd.value === field.value ? "opacity-100" : "opacity-0"
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
                </TableCell>

                <TableCell className="text-right w-[15%]">
                    <FormField
                    control={control}
                    name="noUnits"
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
                    name="perSem"
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
                    name="rateAmount"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input
                            {...field}
                            readOnly
                            value={computedRateAmount}
                            placeholder="Total"
                            />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                </TableCell>
                </TableRow>
            </TableBody>
            </Table>

  
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
              <Save /> Submit </span>
          )}
          </Button>
          </div>
        </form>
  </Form>
</>
);
}
