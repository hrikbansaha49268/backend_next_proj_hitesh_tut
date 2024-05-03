"use client";
import * as  z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/Api.Response";
import {
    Form,
    FormControl,
    FormField,
    FormItem, FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SignUP = () => {

    const [username, setUsername] = useState('');
    const [usernameMsg, setUsernameMsg] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debounced = useDebounceCallback(setUsername, 300);

    const { toast } = useToast();
    const router = useRouter();

    //Zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    useEffect(() => {
        const checkUsernameIsUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMsg('');
                try {
                    const response = await axios.get(
                        `/api/check-username-unique?username=${username}`
                    );
                    setUsernameMsg(response.data.message);
                } catch (error) {
                    const sysError = error as AxiosError<ApiResponse>;
                    setUsernameMsg(sysError.response?.data.message ?? "Error checking username");
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        };
        checkUsernameIsUnique();
    }, [username]);

    const afterSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data);
            toast({
                title: 'Success',
                description: response?.data.message
            });
            router.replace(`/verify/${username}`);
        } catch (error) {
            console.error("Error in signup", error)
            const sysError = error as AxiosError<ApiResponse>;
            toast({
                title: "Signup failed",
                description: sysError.response?.data.message,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false);
        };
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">
                        Sign up to start your anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(afterSubmit)}>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input className="focus-visible:ring-transparent"
                                            placeholder="Enter your desired username"
                                            {...field}
                                            onChange={e => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    {username === '' ?
                                        null :
                                        <>
                                            {isCheckingUsername && <Loader2 className="animate-spin" />}
                                            <p className={`${usernameMsg === "Username is available" ?
                                                "text-green-700" : "text-red-700"}`}>
                                                {usernameMsg}
                                            </p>
                                        </>}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>EMail</FormLabel>
                                    <FormControl>
                                        <Input className="focus-visible:ring-transparent"
                                            placeholder="Enter your email"
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
                                        <Input type="password" className="focus-visible:ring-transparent"
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
                                ) : 'Signup'
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in"
                            className="text-blue-600 hover:text-blue-800">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div >
    );
};

export default SignUP;