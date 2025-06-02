import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { rateDescSchema } from "@/FldrSchema/userSchema.ts";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";

type RateDescFormData = z.infer<typeof rateDescSchema>;

interface RateDescFormFrops {
  editMode?: boolean;
  toEdit?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function RateDescForm({ editMode = false, toEdit = "", onCancel, onSuccess }: RateDescFormFrops) {
  const [isEditing] = useState(editMode);
  const [rdCode] = useState(toEdit);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RateDescFormData>({
    resolver: zodResolver(rateDescSchema),
    defaultValues: {
      rdCode: "",
      rdid: "",
      rdDesc: ""
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (isEditing && rdCode) {
        try {
          setIsLoading(true);
          const response = await axios.get(`${plsConnect()}/API/WebAPI/RateController/GetRateDesc/${rdCode}`)
          
          console.log("Details received:", response.data)
          
          form.setValue("rdCode", rdCode)
          form.setValue("rdid", response.data.rdid)
          form.setValue("rdDesc", response.data.rdDesc)
        } catch (error) {
          console.error("Error fetching details:", error);
          toast.error("Error fetching details.");
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    if (isEditing && rdCode) {
      fetchData();
    }
  }, [isEditing, rdCode, form]);

  const onSubmit = async (values: RateDescFormData) => {
    try {
      setIsLoading(true);
      let response;
      
      if (isEditing) {
        console.log("Updating:", values);
        response = await axios.put(`${plsConnect()}/API/WebAPI/RateController/UpdateRateDesc`, {
          RDCode: values.rdCode,
          rdid: values.rdid,
          RDDesc: values.rdDesc
        });
        toast("Updated successfully.");
      } else {
        console.log("Adding:", values);
        response = await axios.post(
          `${plsConnect()}/API/WebAPI/RateController/InsertRateDesc`,
          {
            rdid: values.rdid,
            RDDesc: values.rdDesc
          });
        toast("Added successfully.");
      }
      
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
        } else if (error.response?.status === 400) {
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
        <h2 className="text-lg font-semibold">{isEditing ? "Edit College" : "Add New College"}</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {isEditing && (
            <FormField
              control={form.control}
              name="rdCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={true} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="rdid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rdDesc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-2">
            {isEditing && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : isEditing ? (
                <span className="flex items-center gap-2">
                  <Save />
                  Update
                </span>
              ) : ("Submit")}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
