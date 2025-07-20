"use client";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { loginUser } from "@/features/auth/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
});

function Page() {
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  // Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const resultAction = await dispatch(loginUser(data));

      // Optional: Check if login was successful
      if (loginUser.fulfilled.match(resultAction)) {
          const loggedInUser = resultAction.payload;
        console.log("Login successful!");
        console.log("User data:", loggedInUser);
        router.push('/overview');
      } else {
        console.log("error", error);
        //  Get error directly from resultAction
        if (resultAction.payload) {
          console.log("Login failed:", resultAction.payload); // e.g. { error: "Invalid credentials" }
        } else {
          console.log("Login error:", resultAction.error); // fallback
        }
      }
    } catch (err) {
      console.log("Unexpected error during login:", err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

     <div className="flex justify-center w-full mb-4">
      <img className="w-[50%] h-auto" src="logo/primary.jpeg" alt="123" />
     </div>


        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="input-wrapper">
              <FormControl>
                <input className="custome-input" placeholder=" " {...field} />
              </FormControl>
              <label className="label">Email</label>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="input-wrapper">
              <FormControl>
                <input
                  className="custome-input"
                  type="password"
                  placeholder="Enter password"
                  {...field}
                />
              </FormControl>
              <label className="label">Password</label>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error Message */}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        {/* Submit Button */}

        <Button
          className=""
          disabled={loading}
          type="submit"
          variant={"signIn"}
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </form>
    </Form>
  );
}

export default Page;
