import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { editRateSchema } from "@/FldrSchema/userSchema";
import { Rate } from "@/FldrTypes/rate";


type RateFormData = z.infer<typeof editRateSchema>;

interface RateFormProps {
  rateCode: string;
  rowNum: string;
  onSubmitSuccess: (updatedRate: Rate) => void;
}

export function EditRate({ rateCode, rowNum, onSubmitSuccess }: RateFormProps) {
    const form = useForm<RateFormData>({
      resolver: zodResolver(editRateSchema),
      defaultValues: {
        subjectCode: "",
        rateTypeCode: "",
        noUnits: 0,
        rateAmount: 0,
      },
      },
    );

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rateTypes, setRateTypes] = useState<{ rateTypeCode: string, rateTypeDesc: string }[]>([]);

    const fetchRate = async () => {
        try {
            if (!rateCode || !rowNum){
                toast("Missing details.");
                return;
            };

            const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/GetRate/${rateCode}/${rowNum}`);

            // console.log(response.data);

            form.setValue("subjectCode", response.data.subjectCode || "");
            form.setValue("noUnits", Number(response.data.noUnits) || 0);
            form.setValue("rateAmount", Number(response.data.rateAmount) || 0);
            form.setValue("rateTypeCode", response.data.rateTypeCode || "");

            console.log(response.data);

            const rateTypeResponse = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListRateType`);
                if (rateTypeResponse.data) {
                    setRateTypes(rateTypeResponse.data);
                }
            
            setLoading(false);
        } catch (error: any) {
            setError("Failed to fetch rate details");
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRate();
      }, [rateCode, rowNum])

    const onSubmit = async (values: RateFormData) => {
        try {
            const updatedRate = {
                rateCode,
                rowNum,
                subjectCode: values.subjectCode,
                noUnits: values.noUnits,
                rateAmount: values.rateAmount,
                rateTypeCode: values.rateTypeCode,
              };
            
            const response = await axios.put(`${plsConnect()}/API/WEBAPI/UpdateEntry/UpdateRate`, updatedRate);
            console.log("Submit: ", response.data)

            

            onSubmitSuccess(response.data);
            toast("Rate updated.")

        } catch (error: any) {
            toast("Something went wrong: ", error)
        }
    }

    if (loading) return <p>Loading rate details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

return (
    <>
    <Form {...form}>
    <form 
    onSubmit={form.handleSubmit(onSubmit)} 
    className="space-y-4">
        <FormField name="subjectCode" control={form.control} render={({ field }) => (
        <FormItem>
            <FormLabel>Subject Code</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
        </FormItem>
        )} />

        <FormField name="noUnits" control={form.control} render={({ field }) => (
        <FormItem>
            <FormLabel>Number of Units</FormLabel>
            <FormControl>
                <Input
                {...field}
                type="number"
                value={field.value}
                onChange={(e) => {
                field.onChange(e.target.value ? Number(e.target.value) : 0);
                }}
                />
            </FormControl>
            <FormMessage />
        </FormItem>
        )} />

        <FormField name="rateAmount" control={form.control} render={({ field }) => (
        <FormItem>
            <FormLabel>Rate Amount</FormLabel>
            <FormControl>
            <Input
                {...field}
                type="number"
                value={field.value}
                onChange={(e) => {
                field.onChange(e.target.value ? Number(e.target.value) : 0);
                }}
            />
            </FormControl>
            <FormMessage />
        </FormItem>
        )} />

        <FormField
            control={form.control}
            name="rateTypeCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rateTypes.map((rateType) => (
                        <SelectItem key={rateType.rateTypeCode} value={rateType.rateTypeCode}>
                        {rateType.rateTypeDesc}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

        <Button type="submit" className="float-right" disabled={loading}>Update</Button>
    </form>
    </Form>
    </>
    )
}