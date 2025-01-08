"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Typography from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { supabaseBrowserClient } from "@/supabase/supabaseClient";
import { registerWithEmail } from "@/actions/register-with-email";

const AuthPage = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getCurrUser = async () => {
  const {
    data: { session },
  } = await supabaseBrowserClient.auth.getSession();

  if (session) {
    router.push('/');
  } else {
    supabaseBrowserClient.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push('/');
      }
    });
  }
};

    getCurrUser();
    setIsMounted(true);
  }, [router]);

  const formSchema = z.object({
    email: z.string().email().min(2, { message: "Email must be 2 characters" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsAuthenticating(true);
    const response = await registerWithEmail(values);
    const { data, error } = JSON.parse(response);
    setIsAuthenticating(false);
    if (error) {
      console.warn("Sign in error", error);
      return;
    }
  }

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-5">
      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full shadow-black/10">
        {/* Logo Card */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p- shadow-md">
            <img
              src="/draftRoom_logo.jpg"
              alt="DraftRoom Logo"
              className="w-48 h-auto"
            />
          </div>
        </div>

        {/* Welcome Message */}
        <Typography
          text="Welcome to DraftRoom"
          variant="h2"
          className="text-center text-primary mb-4"
        />

        <Typography
          text="Your ultimate fantasy football chat platform. Stay connected, strategize, and win your leagues!"
          variant="p"
          className="text-gray-600 text-center mb-6"
        />

        {/* Sign-In Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isAuthenticating}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="bg-gray-100 border-gray-300 rounded-md focus:border-primary focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                variant="secondary"
                className="bg-primary hover:bg-primary-dark w-full mt-4 text-white"
                type="submit"
              >
                <Typography text="Send Magic Link" variant="p" />
              </Button>
            </fieldset>
          </form>
        </Form>

        {/* Footer */}

        <div className="mt-6 text-center">
          <Typography
            text="After submitting, check your email for a Magic Link to log in."
            variant="p"
            className="text-gray-500 mb-2"
          />

          <Typography
            text="Need help? Contact us at support@draftroom.com"
            variant="p"
            className="text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
