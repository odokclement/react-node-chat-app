"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import apiClent from "@/lib/api-client";
import { toast } from "sonner";
import { LOGIN_ROUTE, SINGN_UP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";



// Validation schemas
const signUpSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters long",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

function Auth() {

const navigate = useNavigate();


  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (values) => {
    console.log("Login submitted:", values);

    // e.g., API call, redirect, etc.
    apiClent
      .post(
        LOGIN_ROUTE,
        {
          email: values.email,
          password: values.password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.status === 200) {
          console.log("Login successful:", response.data);
          toast.success("Login successful!");
          // Redirect to home page or dashboard
          navigate("/chat");
        } else {
          console.error("Login failed:", response.data.message);
          toast.error("Login failed: " + response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        toast.error("An error occurred during login.");
      });
  };

  const onSignupSubmit = async (values) => {
    console.log("Signup submitted:", values);
    // Handle successful signup logic here
    // e.g., API call, redirect, etc.
    const response = await apiClent.post(
      SINGN_UP_ROUTE,
      {
        firstname: values.firstName,
        lastname: values.lastName,
        email: values.email,
        password: values.password,
      },
      { withCredentials: true }
    );
    if (response.status === 201) {
      console.log("User created successfully:", response.data);
      toast.success("Account created successfully!");
      // Redirect to login or home page
      navigate("/profile");
    } else {
      console.error("Error creating user:", response.data.message);
      // Handle error (e.g., show notification)
    }
    console.log("Signup submitted:", values);
  };

  return (
    <div className="flex w-full flex-col items-center gap-6 py-8 px-4 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="text-sm md:text-base h-10 md:h-12 w-full">
          <TabsTrigger
            value="login"
            className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3 flex-1"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3 flex-1"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card className="text-sm md:text-base p-4 md:p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-lg md:text-xl text-slate-800">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-sm md:text-base text-slate-600">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <CardContent className="space-y-4 px-0">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium text-slate-700">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            className="h-10 md:h-11 text-sm md:text-base border-2 focus:border-blue-500 transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium text-slate-700">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            className="h-10 md:h-11 text-sm md:text-base border-2 focus:border-blue-500 transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="px-0 pt-2">
                  <Button
                    type="submit"
                    disabled={loginForm.formState.isSubmitting}
                    className="h-10 md:h-11 px-6 md:px-8 text-sm md:text-base w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loginForm.formState.isSubmitting
                      ? "Signing In..."
                      : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card className="text-sm md:text-base p-4 md:p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-lg md:text-xl text-slate-800">
                Create Account
              </CardTitle>
              <CardDescription className="text-sm md:text-base text-slate-600">
                Sign up for a new account to get started
              </CardDescription>
            </CardHeader>
            <Form {...signupForm}>
              <form
                onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                className="space-y-4"
              >
                <CardContent className="space-y-4 px-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <FormField
                      control={signupForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm md:text-base font-medium text-slate-700">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="First name"
                              className="h-10 md:h-11 text-sm md:text-base border-2 focus:border-green-500 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm md:text-base font-medium text-slate-700">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Last name"
                              className="h-10 md:h-11 text-sm md:text-base border-2 focus:border-green-500 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium text-slate-700">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            className="h-10 md:h-11 text-sm md:text-base border-2 focus:border-green-500 transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium text-slate-700">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Create a password"
                            className="h-10 md:h-11 text-sm md:text-base border-2 focus:border-green-500 transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium text-slate-700">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            className="h-10 md:h-11 text-sm md:text-base border-2 focus:border-green-500 transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="px-0 pt-2">
                  <Button
                    type="submit"
                    disabled={signupForm.formState.isSubmitting}
                    className="h-10 md:h-11 px-6 md:px-8 text-sm md:text-base w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {signupForm.formState.isSubmitting
                      ? "Creating Account..."
                      : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Auth;
