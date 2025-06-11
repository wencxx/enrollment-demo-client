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
import { professorSchema } from "@/FldrSchema/userSchema";

type ProfessorFormData = z.infer<typeof professorSchema> & {
  professorName: string
};

interface CourseFormProps {
  data: {
    professorCode: string;
    professorName: string;
  },
  getProfessor: () => Promise<void> ,
  setOpenEdit: (openEdit: boolean) => void,
}

export function EditProfessor({ data , getProfessor, setOpenEdit}: CourseFormProps) {
  const form = useForm<ProfessorFormData>({
    resolver: zodResolver(professorSchema),
    defaultValues: {
      professorName: data.professorName
    }
  },
  );


  const onSubmit = async (values: ProfessorFormData) => {
    try {
      const formattedValues = {
        professorCode: data.professorCode,
        professorName: values.professorName,
      };

      await axios.put(
        `${plsConnect()}/api/Professors`,
        formattedValues,
      );

      await getProfessor()
      setOpenEdit(false)
      toast("Professor updated successfully.");
    } catch (error: any) {
      toast("Error updating course details.");
      console.log(error)
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Edit Professor</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4">
          <FormField name="professorName" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Professor Name</FormLabel>
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
