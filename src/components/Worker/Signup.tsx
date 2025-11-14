"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PulseLoader } from "react-spinners";
import { CgAdd } from "react-icons/cg";
import { useState } from "react";
import { signUp } from "@/lib/features/api/workerApiSlice";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { signUPformSchema } from "../../lib/formSchema";
import { useDispatch } from "react-redux";
import { updateSignup } from "../../lib/features/slices/workerSlice";
import Link from "next/link";

export default function WorkerSignUp() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof signUPformSchema>>({
    resolver: zodResolver(signUPformSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      emailAddress: "",
      password: "",
      confirmPass: "",
    },
  });

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicUrl(URL.createObjectURL(file));
    } else {
      setProfilePicFile(null);
      setProfilePicUrl(null);
    }
  }

  async function onSubmit(values: z.infer<typeof signUPformSchema>) {
    try {
      const checkNumber: RegExpMatchArray | any = values.phoneNumber.match(/(\d+)/);
      if (!profilePicFile) return toast.error("Please select a profile picture");
      if (checkNumber[0].length != 10)
        return toast.error("Please enter a valid 10-digit number");

      if (isLoading) return;
      setIsloading(true);

      const formData: any = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("emailAddress", values.emailAddress);
      formData.append("password", values.password);
      formData.append("profileImage", profilePicFile);

      const res = await signUp(formData);

      if (res.success) {
        dispatch(updateSignup(res.workerDetails));
        toast.success("Signup successful!");
        setTimeout(() => {
          router.replace(`/worker/professionalInfo`);
        }, 800);
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "Signup failed");
    } finally {
      setIsloading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 py-10">
      <div className="w-full max-w-[72rem] bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-slate-800">
          Personal Information
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col md:flex-row gap-6 w-full"
          >
            {/* Left Section */}
            <div className="md:w-3/5 w-full">
              <div className="flex flex-col md:flex-row md:gap-12 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your first name"
                          {...field}
                          className="p-3 rounded-lg w-full border border-gray-200 focus:ring-2 focus:ring-indigo-300 transition"
                        />
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
                        <Input
                          placeholder="Enter your last name"
                          {...field}
                          className="p-3 rounded-lg w-full border border-gray-200 focus:ring-2 focus:ring-indigo-300 transition"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your phone number"
                        {...field}
                        className="p-3 rounded-lg w-full border border-gray-200 focus:ring-2 focus:ring-indigo-300 transition"
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
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        className="p-3 rounded-lg w-full border border-gray-200 focus:ring-2 focus:ring-indigo-300 transition"
                      />
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
                          className="p-3 rounded-lg w-full border border-gray-200 focus:ring-2 focus:ring-indigo-300 transition"
                        />
                        <div
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-slate-500 hover:text-slate-700"
                        >
                          {showPassword ? (
                            <AiFillEyeInvisible />
                          ) : (
                            <AiFillEye />
                          )}
                        </div>
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
                          className="p-3 rounded-lg w-full border border-gray-200 focus:ring-2 focus:ring-indigo-300 transition"
                        />
                        <div
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-slate-500 hover:text-slate-700"
                        >
                          {showConfirmPassword ? (
                            <AiFillEyeInvisible />
                          ) : (
                            <AiFillEye />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:shadow-md transition-all"
              >
                {isLoading ? (
                  <PulseLoader size={8} color="#fff" />
                ) : (
                  "Continue with Email"
                )}
              </Button>
            </div>

            {/* Right Section */}
            <div className="md:w-2/5 w-full flex flex-col items-center md:items-start">
              {profilePicUrl ? (
                <div className="w-[120px] h-[120px] rounded-full overflow-hidden ring-2 ring-indigo-200 shadow">
                  <Image
                    src={profilePicUrl}
                    className="object-cover"
                    width={120}
                    height={120}
                    alt="Profile Picture"
                  />
                </div>
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400 ring-1 ring-indigo-100">
                  <CgAdd size={34} />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profilePicInput"
              />

              <label
                htmlFor="profilePicInput"
                className="w-full md:w-auto mt-4 inline-flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-indigo-50 cursor-pointer transition"
              >
                Upload Image
              </label>

              <p className="text-xs text-slate-400 mt-2">
                PNG, JPG up to 2MB. This will be used as your public profile
                picture.
              </p>

              <h2 className="mt-6 text-sm text-slate-600">
                Already have an account?{" "}
                <span className="text-indigo-600 hover:underline cursor-pointer">
                  <Link href={"/worker/login"}>Sign In</Link>
                </span>
              </h2>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
