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
import { elementarySchema } from "@/FldrSchema/userSchema";

type ElementaryFormData = z.infer<typeof elementarySchema> & {
  elementaryDesc: string
};

interface CourseFormProps {
  data: {
    elementaryCode: string;
    elementaryDesc: string;
  },
  getElementary: () => Promise<void> ,
  setOpenEdit: (openEdit: boolean) => void,
}

export function EditElementary({ data , getElementary, setOpenEdit}: CourseFormProps) {
  const form = useForm<ElementaryFormData>({
    resolver: zodResolver(elementarySchema),
    defaultValues: {
      elementaryDesc: data.elementaryDesc
    }
  },
  );


  const onSubmit = async (values: ElementaryFormData) => {
    try {
      const formattedValues = {
        elementaryCode: data.elementaryCode,
        elementaryDesc: values.elementaryDesc,
      };

      await axios.put(
        `${plsConnect()}/api/Elementary`,
        formattedValues,
      );

      await getElementary()
      setOpenEdit(false)
      toast("Elementary updated successfully.");
    } catch (error) {
      toast("Error updating course details.");
      console.log(error)
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Edit Elementary</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4">
          <FormField name="elementaryDesc" control={form.control} render={({ field }) => (
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
