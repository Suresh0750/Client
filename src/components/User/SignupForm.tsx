"use client";

// Import necessary libraries
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUp} from '@/lib/features/api/userApiSlice';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Toaster, toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // for password visibility
import {updateRole } from '@/lib/features/slices/customerSlice';
import { useDispatch } from 'react-redux';
import { userSignUpFormSchema } from '@/lib/formSchema';


// Signup Form component
export function SignupForm() {
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();


  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.input<typeof userSignUpFormSchema>>({
    resolver: zodResolver(userSignUpFormSchema),
    defaultValues: {
      username: "",
      phoneNumber: "",  
      emailAddress: "",
      address: "",
      password: "",
      confirmPass: "",
    },    
  });

  // Handle form submission
  async function onSubmit(values: z.input<typeof userSignUpFormSchema>) {
    try {
      if (isLoading) return;
      setLoading(true);

      // convert phoneNumber (string) to number for the API payload
      const payload: any = {
        ...values,
        phoneNumber:
          typeof values.phoneNumber === "string" && values.phoneNumber.trim() !== ""
            ? parseInt(values.phoneNumber, 10)
            : undefined,
      };

      const res = await signUp(payload);
      console.log(res);

      if (res.success) {
        toast.success('🎉 User registration successful!');
        setTimeout(() => {
          router.replace(`/user/userOtp/${res.user}`);
        }, 500);
      } else {
        // Handle known backend validation or duplication errors
        const message = res.message || "Registration failed. Please check your details and try again.";
        toast.error(message);
      }
    } catch (error: any) {
      console.error("Signup Error:", error);

      // Extract readable error messages
      let message = "An unexpected error occurred. Please try again later.";

      // Axios/network related errors
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 400) {
          message = data.message || "Invalid input. Please verify your details and try again.";
        } else if (status === 401) {
          message = "Unauthorized request. Please login again.";
        } else if (status === 403) {
          message = "You are not allowed to perform this action.";
        } else if (status === 404) {
          message = "Requested resource not found.";
        } else if (status === 409) {
          // Duplicate user case
          message = data.message || "User with this email or phone number already exists.";
        } else if (status >= 500) {
          message = "Server error. Please try again later.";
        }
      } else if (error.request) {
        message = "Network error. Please check your internet connection.";
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} className="p-2 rounded w-full border border-gray-300" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    type="tel"
                    placeholder="Enter your phone number" 
                    {...field} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      field.onChange(value.toString());
                    }}
                    className="p-2 rounded w-full border border-gray-300" 
                  />
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
                  <Input type="email" placeholder="Enter your email" {...field} className="p-2 rounded w-full border border-gray-300" />
                </FormControl>
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
                  <Input placeholder="Enter your address" {...field} className="p-2 rounded w-full border border-gray-300" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                      className="p-2 rounded w-full border border-gray-300"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      {...field}
                      className="p-2 rounded w-full border border-gray-300"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <Toaster richColors position="top-center" /> */}
          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 mt-4 bg-[#90CAF9] text-white rounded hover:bg-blue-700 ${isLoading && "cursor-not-allowed"}`}
          >
            {isLoading ? <PulseLoader /> : "Continue with Email"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
