import { z } from "zod";

export const SignInSchema = z.object({
    identifier: z.string().min(1, "Please enter a value"),
    password: z.string().min(1, "Please enter a value")
});