import { useState, useEffect } from "react";
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
// import { Calendar } from "@/components/ui/calendar";
// import { CalendarIcon } from "lucide-react";
// import { format } from "date-fns";
import { toast } from "sonner";
import { formSchema } from "@/FldrSchema/application";
import useAuthStore from "@/FldrStore/auth";
import { FormField, FormMessage, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"


export type FormValues = z.infer<typeof formSchema>;

interface TownCity {
  value: string;
  label: string;
}

interface Barangay {
  value: string;
  label: string;
}

interface Elementary {
  value: string;
  label: string;
}

interface HighSchool {
  label: string;
  value: string;
}

export default function StudentApplication() {
  const [selectedCity, setSelectedCity] = useState('064501000')

  const [townCities, setTownCities] = useState<TownCity[]>([]);
  const [barangay, setBarangay] = useState<Barangay[]>([]);


  const [submitting, setSubmitting] = useState(false);
  const [elementarySchools, setElementarySchools] = useState<Elementary[]>([]);
  const [highSchools, setHighSchools] = useState<HighSchool[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      genderCode: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const townCityResponse = await axios.get(`https://psgc.gitlab.io/api/provinces/064500000/cities-municipalities/`);
        const mappedTownCityResponse = townCityResponse.data.map((item: { name: string, code: string }) => ({
          label: item.name,
          value: item.code,
        }));
        setTownCities(mappedTownCityResponse);

        const elementaryResponse = await axios.get(`${plsConnect()}/api/Elementary`);
        const mappedElementaryResponse = elementaryResponse.data.map((item: { elementaryDesc: string, elementaryCode: string }) => ({
          label: item.elementaryDesc,
          value: item.elementaryCode,
        }));
        setElementarySchools(mappedElementaryResponse);

        const highSchoolResponse = await axios.get(`${plsConnect()}/api/Highschool`);
        const mappedHighSchoolResponse = highSchoolResponse.data.map((item: { hsDesc: string, hsCode: string }) => ({
          label: item.hsDesc,
          value: item.hsCode,
        }));
        setHighSchools(mappedHighSchoolResponse);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to load some form data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchBarangay = async () => {
    try {
      const barangayResponse = await axios.get(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCity}/barangays/`);
      const mappedBarangay = barangayResponse.data.map((item: { name: string, code: string }) => ({
        label: item.name,
        value: item.code,
      }));
      setBarangay(mappedBarangay);
    } catch (error) {
      console.error(error)
    }
  }


  useEffect(() => {
    fetchBarangay()
  }, [selectedCity])

  const { currentUser } = useAuthStore.getState();
  if (!currentUser) {
    toast("User not logged in.");
    return;
  }

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);

      // Find the label for the selected city code
      const selectedCityObj = townCities.find(city => city.value === values.city);
      const cityLabel = selectedCityObj ? selectedCityObj.label : values.city;

      // Find the label for the selected barangay code
      const selectedBarangayObj = barangay.find(brgy => brgy.value === values.barangay);
      const barangayLabel = selectedBarangayObj ? selectedBarangayObj.label : values.barangay;

      const applicationData = {
        ...values,
        address: `${barangayLabel}, ${cityLabel}`,
        userCode: currentUser.userCode,
      };

      console.log("Submitting to API:", applicationData);

      const response = await axios.post(
        `${plsConnect()}/API/WebAPI/StudentController/SubmitStudentApplication`,
        applicationData
      );

      if (response.data && response.data.success === true) {
        toast.success(response.data.message || "Application submitted successfully!");
      } else if (response.status >= 200 && response.status < 300) {
        toast.success("Application submitted successfully!");
      } else {
        toast.error(response.data?.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      let backendMessage = "";
      if (axios.isAxiosError(error)) {
        backendMessage = error.response?.data?.message;
      }
      if (backendMessage) {
        toast.error(backendMessage);
      } else {
        toast.error("Error submitting application. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 mt-4">Student Application Form</h1>
      {loading ? (
        <div className="flex justify-center my-8">Loading form data...</div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardContent className="space-y-8">
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a suffix" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value=" ">None</SelectItem>
                              <SelectItem value="Jr.">Jr.</SelectItem>
                              <SelectItem value="Sr.">Sr.</SelectItem>
                              <SelectItem value="II">II</SelectItem>
                              <SelectItem value="III">III</SelectItem>
                              <SelectItem value="IV">IV</SelectItem>
                              <SelectItem value="V">V</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* <FormField
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
                                  className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""
                                    }`}
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
                                captionLayout="dropdown"
                                fromYear={1900}
                                toYear={new Date().getFullYear()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <input
                              type="date"
                              value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                              onChange={e => {
                                const val = e.target.value;
                                field.onChange(val ? new Date(val) : undefined);
                              }}
                              max={new Date().toISOString().split("T")[0]}
                              min="1900-01-01"
                              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                            />
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
                              <SelectTrigger
                                className={`${form.formState.errors.genderCode ? "border-red-500" : ""} w-full`}
                              >
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

                    {/* Town City */}
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Town/City</FormLabel>
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
                                    ? townCities.find(
                                      (city) => city.value === field.value
                                    )?.label
                                    : "Select Town/City"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search town/city..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>No town/city found.</CommandEmpty>
                                  <CommandGroup>
                                    {townCities.map((city) => (
                                      <CommandItem
                                        value={city.value}
                                        key={city.value}
                                        onSelect={() => {
                                          form.setValue("city", city.label);
                                          field.onChange(city.value);
                                          setSelectedCity(city.value)
                                        }}
                                      >
                                        {city.label}
                                        <Check
                                          className={cn(
                                            "ml-auto h-4 w-4",
                                            city.value === field.value
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Barangay City */}
                    <FormField
                      control={form.control}
                      name="barangay"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Barangay</FormLabel>
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
                                    ? barangay.find(
                                      (brgy) => brgy.value === field.value
                                    )?.label
                                    : "Select Barangay"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search town/city..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>No barangay found.</CommandEmpty>
                                  <CommandGroup>
                                    {barangay.map((brgy) => (
                                      <CommandItem
                                        value={brgy.value}
                                        key={brgy.value}
                                        onSelect={() => {
                                          form.setValue("barangay", brgy.label);
                                          field.onChange(brgy.value);
                                        }}
                                      >
                                        {brgy.label}
                                        <Check
                                          className={cn(
                                            "ml-auto h-4 w-4",
                                            brgy.value === field.value
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

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

                <div>
                  <h2 className="text-xl font-semibold mb-4">Education Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <FormField
                      control={form.control}
                      name="hsCode"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>High School</FormLabel>
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
                                    ? highSchools.find(
                                      (school) => school.value === field.value
                                    )?.label
                                    : "Select High School"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search high school..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>No high school found.</CommandEmpty>
                                  <CommandGroup>
                                    {highSchools.map((school) => (
                                      <CommandItem
                                        value={school.label}
                                        key={school.value}
                                        onSelect={() => {
                                          form.setValue("hsCode", school.value);
                                          field.onChange(school.value);
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto h-4 w-4",
                                            school.value === field.value
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
                        <FormItem className="flex flex-col">
                          <FormLabel>Elementary</FormLabel>
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
                                    ? elementarySchools.find(
                                      (school) => school.value === field.value
                                    )?.label
                                    : "Select Elementary"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search elementary..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>No elementary found.</CommandEmpty>
                                  <CommandGroup>
                                    {elementarySchools.map((school) => (
                                      <CommandItem
                                        value={school.label}
                                        key={school.value}
                                        onSelect={() => {
                                          form.setValue("elementaryCode", school.value);
                                          field.onChange(school.value);
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto h-4 w-4",
                                            school.value === field.value
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
                  disabled={submitting || loading}
                  onClick={() => {
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
      )}
    </div>
  );
}
