import { zodResolver } from "@hookform/resolvers/zod";
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
import { highschoolSchema } from "@/FldrSchema/userSchema";

type HighSchoolFormData = z.infer<typeof highschoolSchema> & {
  hsDesc: string
};

interface CourseFormProps {
  data: {
    hsCode: string;
    hsDesc: string;
  },
  getHighschool: () => Promise<void> ,
  setOpenEdit: (openEdit: boolean) => void,
}

export function EditHighschool({ data , getHighschool, setOpenEdit}: CourseFormProps) {
  const form = useForm<HighSchoolFormData>({
    resolver: zodResolver(highschoolSchema),
    defaultValues: {
      hsDesc: data.hsDesc
    }
  },
  );


  const onSubmit = async (values: HighSchoolFormData) => {
    try {
      const formattedValues = {
        hsCode: data.hsCode,
        hsDesc: values.hsDesc,
      };

      await axios.put(
        `${plsConnect()}/api/Highschool`,
        formattedValues,
      );

      await getHighschool()
      setOpenEdit(false)
      toast("Highschool updated successfully.");
    } catch (error) {
      toast("Error updating course details.");
      console.log(error)
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Edit High School</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4">
          <FormField name="hsDesc" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Highschool Description</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" className="float-right">Update</Button>
        </form>
      </Form>
    </>
  );
}
