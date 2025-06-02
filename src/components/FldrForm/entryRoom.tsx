// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { plsConnect } from "@/FldrClass/ClsGetConnection";
// import axios from "axios";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { roomSchema } from "@/FldrSchema/userSchema.ts";
// import { useEffect, useState } from "react";
// import { Save } from "lucide-react";

// type RoomFormData = z.infer<typeof roomSchema>;

// interface RoomFormProps {
//   editMode?: boolean;
//   toEdit?: string;
//   onCancel?: () => void;
//   onSuccess?: () => void;
// }

// export function RoomForm({ editMode = false, toEdit = "", onCancel, onSuccess }: RoomFormProps) {
//   const [isEditing] = useState(editMode);
//   const [roomCode] = useState(toEdit);
//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm<RoomFormData>({
//     resolver: zodResolver(roomSchema),
//     defaultValues: {
//       roomCode: "",
//       roomDesc: "",
//     },
//   });

//   useEffect(() => {
//     const fetchRooms = async () => {
//       if (isEditing && roomCode) {
//         try {
//           setIsLoading(true);
//           const response = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListRoom`);
          
//           console.log("List received:", response.data);
  
//           const list = response.data.find((list: { roomCode: string }) => list.roomCode === roomCode);
  
//           if (list) {
//             form.setValue("roomCode", list.roomCode || "");
//             form.setValue("roomDesc", list.roomDesc || "");
//           } else {
//             toast.error("Room not found.");
//           }
//         } catch (error) {
//           console.error("Error fetching room details:", error);
//           toast.error("Error fetching room details.");
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };
  
//     if (isEditing && roomCode) {
//       fetchRooms();
//     }
//   }, [isEditing, roomCode, form]);

//   const onSubmit = async (values: RoomFormData) => {
//     try {
//       setIsLoading(true);
//       let response;
      
//       if (isEditing) {
//         console.log("Updating room:", values);
//         response = await axios.put(`${plsConnect()}/API/WEBAPI/UpdateEntry/UpdateRoom`, {
//           RoomCode: values.roomCode,
//           RoomDesc: values.roomDesc
//         });
//         toast("Room updated successfully.");
//       } else {
//         console.log("Adding new room:", values);
//         response = await axios.post(
//           `${plsConnect()}/API/WEBAPI/InsertEntry/InsertRoom`,
//           {
//             roomDesc: values.roomDesc,
//           });
//         toast("Room added successfully.");
//       }
      
//       console.log("API response:", response.data);
//       form.reset();
//       if (onSuccess) {
//         onSuccess();
//       }
//       if (onCancel) {
//         onCancel();
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         const errorMessage = error.response?.data || "An error occurred.";
//         if (error.response?.status === 409) {
//           toast.error(errorMessage);
//         } else if (error.response?.status === 400) {
//           toast.error(errorMessage);
//         } else {
//           toast.error("An unexpected error occurred.");
//         }
//         console.error("API error:", error.response?.data);
//       } else {
//         console.error("Network error:", error);
//         toast.error("Network error.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">{isEditing ? "Edit Room" : "Add New Room"}</h2>
//       </div>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           {isEditing && (
//             <FormField
//               control={form.control}
//               name="roomCode"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Room Code</FormLabel>
//                   <FormControl>
//                     <Input {...field} disabled={true} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           )}

//           <FormField
//             control={form.control}
//             name="roomDesc"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Room Description</FormLabel>
//                 <FormControl>
//                   <Input {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
          
//           <div className="flex justify-end gap-2">
//             {isEditing && onCancel && (
//               <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
//                 Cancel
//               </Button>
//             )}
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? (
//                 <span className="flex items-center">
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </span>
//               ) : isEditing ? (
//                 <span className="flex items-center gap-2">
//                   <Save />
//                   Update
//                 </span>
//               ) : ("Submit")}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </>
//   );
// }

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
import { roomSchema } from "@/FldrSchema/userSchema.ts";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";

type FormData = z.infer<typeof roomSchema>;

interface FormProps {
  editMode?: boolean;
  toEdit?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function RoomForm({ editMode = false, toEdit = "", onCancel, onSuccess }: FormProps) {
  const [isEditing] = useState(editMode);
  const [roomCode] = useState(toEdit);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomCode: "",
      roomDesc: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (isEditing && roomCode) {
        try {
          setIsLoading(true);
          const response = await axios.get(`${plsConnect()}/API/WebAPI/ListController/GetRoom/${roomCode}`)
          
          console.log("Details received:", response.data)
          
          form.setValue("roomCode", roomCode)
          form.setValue("roomDesc", response.data.roomDesc)
        } catch (error) {
          console.error("Error fetching details:", error);
          toast.error("Error fetching details.");
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    if (isEditing && roomCode) {
      fetchData();
    }
  }, [isEditing, roomCode, form]);

  const onSubmit = async (values: FormData) => {
    try {
      setIsLoading(true);
      let response;
      
      if (isEditing) {
        console.log("Updating:", values);
        response = await axios.put(`${plsConnect()}/API/WEBAPI/UpdateEntry/UpdateRoom`, {
          RoomCode: values.roomCode,
          RoomDesc: values.roomDesc
        });
        toast("Updated successfully.");
      } else {
        console.log("Adding:", values);
        response = await axios.post(`${plsConnect()}/API/WEBAPI/InsertEntry/InsertRoom`,
          { roomDesc: values.roomDesc });
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
        <h2 className="text-lg font-semibold">{isEditing ? "Edit Room" : "Add New Room"}</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {isEditing && (
            <FormField
              control={form.control}
              name="roomCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Code</FormLabel>
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
            name="roomDesc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Description</FormLabel>
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
