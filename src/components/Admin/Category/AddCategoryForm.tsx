
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormSchema } from "@/lib/formSchema";
import { addCategory } from "../../../lib/features/api/adminApiSlice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button, Input, Tooltip } from "@mui/material";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import {useState} from 'react'



type AddCategoryFormProps = {
  isModal?: boolean;
  onClose?: () => void;
};

const AddCategoryForm = ({ isModal = false, onClose }: AddCategoryFormProps) => {
  const router = useRouter();

  const [isLoading,setIsLoading] = useState<boolean>(false)

  // * Admin RTK api
  // const [AddCategoryForm, { isError, isLoading }] = useAddCategoryFormMutation();
  const [page,setPage]= useState(1)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      CategoryName: "",
      Description: "",
      CategoryImage: undefined,
      
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const formData: FormData = new FormData();

      if(isLoading) return // * prevent the multiple click
      setIsLoading(true)
      formData.append("categoryName", data.CategoryName);
      formData.append("categoryDescription", data.Description);
      if (data.CategoryImage) {
        formData.append("categoryImage", data.CategoryImage);
      }

      const res = await addCategory(formData)
      
      if (res?.success) {
        toast.success(res?.message); 
        window.location.reload()
      }
    } catch (error:any) {
      console.log(`Error from add category form \n`, error);
      toast.error(error?.message)
    } finally{
      setIsLoading(false)
    }
  }

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (isModal) {
      return (
        <div className="w-full max-w-lg mx-auto">
          <div className="relative bg-[#111b2a] rounded-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] border border-slate-800 px-8 py-8">
            {onClose && (
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
              >
                ×
              </button>
            )}
            {children}
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#111b2a] rounded-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] border border-slate-800 px-8 py-10">
          {children}
        </div>
      </div>
    );
  };

  return (
    <Wrapper>
      <h2 className="text-2xl font-semibold mb-2 text-center text-white">Add Category</h2>
      <p className="text-center text-slate-400 mb-8 text-sm">
        Create a new service category for admins to manage offerings.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
          <FormField
            control={form.control}
            name="CategoryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-300">Category Name</FormLabel>
                <Tooltip title="Enter a unique category name" arrow>
                  <FormControl>
                    <Input
                      autoFocus={isModal}
                      placeholder="Category Name"
                      {...field}
                      className="w-full mt-2 border border-slate-700 bg-slate-900/70 text-white focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:border-transparent"
                    />
                  </FormControl>
                </Tooltip>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-300">Description</FormLabel>
                <Tooltip title="Provide a detailed description" arrow>
                  <FormControl>
                    <Textarea
                      placeholder="Type your description here..."
                      {...field}
                      className="w-full mt-2 border border-slate-700 bg-slate-900/70 text-white focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:border-transparent"
                    />
                  </FormControl>
                </Tooltip>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="CategoryImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-300">Upload File</FormLabel>
                <Tooltip title="Choose an image for the category" arrow>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e: any) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                      className="w-full mt-2 border border-slate-700 bg-slate-900/70 text-white file:bg-slate-800 file:border-0 file:mr-4 file:px-3 file:py-2 file:text-sm file:text-slate-200 cursor-pointer"
                    />
                  </FormControl>
                </Tooltip>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />
          {/* <Toaster richColors position="top-right" /> */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={`mt-2 w-full py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 ${isLoading ? "opacity-50" : ""}`}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
      <p className="text-center text-xs text-slate-500 mt-6">
        Need help? Contact support@profinder.com
      </p>
    </Wrapper>
  );
};

export default AddCategoryForm;
