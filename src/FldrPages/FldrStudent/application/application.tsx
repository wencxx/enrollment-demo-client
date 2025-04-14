import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { formSchema } from "@/FldrSchema/application";
import useAuthStore from "@/FldrStore/auth";
import { FormField, FormMessage, FormControl, FormItem, FormLabel } from "@/components/ui/form";

export type FormValues = z.infer<typeof formSchema>;

export default function StudentApplication() {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur", 
    defaultValues: {
      genderCode: "", 
    }
  });

  const { currentUser } = useAuthStore.getState();
  if (!currentUser) {
    toast("User not logged in.");
    return;
  }

  const onSubmit = async (values: FormValues) => {
    console.log("Submitting form with values:", values); 
        try {
      setSubmitting(true);

      const applicationData = {
        ...values,
        userCode: currentUser.userCode,
      };

      console.log("Submitting to API:", applicationData);

      const response = await axios.post(`${plsConnect()}/API/WebAPI/StudentController/SubmitStudentApplication`, applicationData);

      if (response.data && response.data.success === true) {
        toast.success(response.data.message || "Application submitted successfully!");
      } else if (response.status >= 200 && response.status < 300) {
        toast.success("Application submitted successfully!");
      } else {
        toast.error(response.data?.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error); // Debugging
      toast.error("Error submitting application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 mt-4">Student Application Form</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardContent className="space-y-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="suffix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suffix</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                              >
                                {field.value ? format(field.value, "PPP") : "Select date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  <FormField
                    control={form.control}
                    name="genderCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value || ""}
                          onOpenChange={() => {
                            if (form.formState.errors.genderCode) {
                              form.clearErrors("genderCode");
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className={form.formState.errors.genderCode ? "border-red-500" : ""}>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Male</SelectItem>
                            <SelectItem value="2">Female</SelectItem>
                            <SelectItem value="3">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tcCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Town/City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contactNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Education Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Education Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="hsCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>High School Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hsYearGraduated"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>High School Year Graduated</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="elementaryCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Elementary School Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ElementaryGraduated"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Elementary Year Graduated</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button 
                type="button" 
                disabled={submitting}
                onClick={() => {
                  form.trigger(); // Trigger validation for all fields
                  const isValid = form.formState.isValid;
                  
                  if (!isValid) {
                    toast.error("Please fill in all required fields");
                    return;
                  }
                  
                  const values = form.getValues();
                  onSubmit(values);
                }}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
