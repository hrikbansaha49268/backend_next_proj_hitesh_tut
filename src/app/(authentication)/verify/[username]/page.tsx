"use client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/Api.Response";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const VerifyAccount = () => {

    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();

    const zodFormSignInImplementaion = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            });
            toast({
                title: "Verification Succesful",
                description: response.data.message,
                variant: "default"
            });
            router.replace('/sign-in')
        } catch (error) {
            console.error("Error in signup", error)
            const sysError = error as AxiosError<ApiResponse>;
            toast({
                title: "Verification failed",
                description: sysError.response?.data.message,
                variant: "destructive"
            })
        };
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify your account
                    </h1>
                    <p className="mb-4">
                        Enter the verification code sent on your email
                    </p>
                </div>
                <Form {...zodFormSignInImplementaion}>
                    <form className="space-y-6"
                        onSubmit={zodFormSignInImplementaion.handleSubmit(onSubmit)}>
                        <FormField
                            control={zodFormSignInImplementaion.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Verification Code
                                    </FormLabel>
                                    <FormControl>
                                        <Input className="focus-visible:ring-transparent"
                                            placeholder="Enter the code here" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                            Verify
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default VerifyAccount;