import { useForm } from "react-hook-form";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
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
import { Rate1Col, RateDescCol, RateTypeCol } from "@/FldrTypes/kim-types";
import { cn } from "@/lib/utils";
import { rate2Schema } from "@/FldrSchema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { z } from "zod";

type Rate2FormData = z.infer<typeof rate2Schema>;

interface Rate2FormProps {
    toEdit?: string;
    onCancel?: () => void;
    onSuccess?: () => void;
}

export function EditRate2Form({ toEdit = "", onCancel, onSuccess }: Rate2FormProps) {

  const form = useForm<Rate2FormData>({
          resolver: zodResolver(rate2Schema),
          defaultValues: {
              pkRate: "",
              pkRate1: "",
              rdCode: "",
              rateTypeCode: "",
              noUnits: 0,
              rateAmount: 0,
          },
        });

const [isLoading, setIsLoading] = useState(false);
const [rateDesc, setRateDesc] = useState<RateDescCol[]>([])
const [rateType, setRateType] = useState<RateTypeCol[]>([])
const [rate1, setRate1] = useState<Rate1Col[]>([])
const [pkRate] = useState(toEdit);
    
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

            const rate1Res = await axios.get(`${plsConnect()}/API/WEBAPI/RateController/ListRate1`)
            const mappedRate1 = rate1Res.data.map((item: Rate1Col) => ({
            label: `${item.courseDesc} - ${item.yearDesc}`,
            value: item.pkRate1,
            }))
            setRate1(mappedRate1)
            
            if (pkRate) {
                const entryRes = await axios.get(`${plsConnect()}/API/WEBAPI/RateController/ListRate2`);
                const entryData = entryRes.data.find((entry: Rate2FormData) => entry.pkRate === pkRate);
                
                form.reset({
                  pkRate: entryData.pkRate,
                  noUnits: entryData.noUnits,
                  rateAmount: entryData.rateAmount,
                  rdCode: entryData.rdCode,
                  rateTypeCode: entryData.rateTypeCode,
                  pkRate1: entryData.pkRate1,
                });
              }
        } catch (error) {
            console.error("Error fetching data:", error)
            toast("Error fetching data.")
        } finally {
            setIsLoading(false);
          }
        }
        fetchData()
    }, [pkRate]);

  const onSubmit = async (values: Rate2FormData) => {
    try {
        console.log("Form values:", values);
        setIsLoading(true);
        const response = await axios.put(`${plsConnect()}/API/WebAPI/RateController/UpdateRate2`, values);
        toast("Rate2 updated successfully.");
      
      console.log("API response:", response.data);
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
        <h2 className="text-lg font-semibold">Edit Rate2</h2>
        </div>
    
        <Form {...form}>
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
                            : "Select Rate Description"}
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
                <Select
                    onValueChange={(value) => {
                    form.setValue("rateTypeCode", value);
                    field.onChange(value);
                    }}
                    value={field.value}
                >
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
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
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
                    <Save/>
                    Update
                    </span>
                )}
            </Button>
            </div>
        </form>
        </Form>
    </>
    );
    }