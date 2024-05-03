"use client";
import * as  z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SignInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const SignIN = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { toast } = useToast();
    const router = useRouter();

    //Zod implementation

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    });

    const afterSubmit = async (data: z.infer<typeof SignInSchema>) => {
        setIsSubmitting(true);
        const result = await signIn('credentials', {
            identifier: data.identifier,
            password: data.password,
            redirect: false
        });

        if (result?.error) {
            toast({
                title: 'Login Failed',
                description: 'Incorrect username or password',
                variant: "destructive"
            });
            setIsSubmitting(false);
        };

        if (result?.url) {
            router.replace('/dashboard');
            setIsSubmitting(false);
        };
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Mystery Message
                    </h1>
                    <p className="mb-4">
                        Sign in to see your anonymous messages
                    </p>
                </div>
                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(afterSubmit)}>
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email or Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your email or username"
                                            {...field}
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
                                        <Input type="password"
                                            placeholder="Enter your Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                                    </>
                                ) : 'Signin'
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Not a member?{' '}
                        <Link href="/sign-in"
                            className="text-blue-600 hover:text-blue-800">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div >
    );
};

export default SignIN;