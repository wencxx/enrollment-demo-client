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
import { townSchema } from "@/FldrSchema/userSchema";

type TownFormData = z.infer<typeof townSchema> & {
  tcDesc: string
};

interface CourseFormProps {
  data: {
    tcCode: string;
    tcDesc: string;
  },
  getTown: () => Promise<void> ,
  setOpenEdit: (openEdit: boolean) => void,
}

export function EditTown({ data , getTown, setOpenEdit}: CourseFormProps) {
  const form = useForm<TownFormData>({
    resolver: zodResolver(townSchema),
    defaultValues: {
      tcDesc: data.tcDesc
    }
  },
  );


  const onSubmit = async (values: TownFormData) => {
    try {
      const formattedValues = {
        tcCode: data.tcCode,
        tcDesc: values.tcDesc,
      };

      await axios.put(
        `${plsConnect()}/api/Elementary`,
        formattedValues,
      );

      await getTown()
      setOpenEdit(false)
      toast("Elementary updated successfully.");
    } catch (error: any) {
      toast("Error updating course details.");
      console.log(error)
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Edit Town/City</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4">
          <FormField name="tcDesc" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Town/City Description</FormLabel>
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
