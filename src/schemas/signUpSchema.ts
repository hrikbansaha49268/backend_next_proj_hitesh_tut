import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(20, "Username must not be more characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username mustn't contain special characters")

const passwordValidation = z.string()
    .min(2, { message: "Password must be atleast 2 characters" })
    .max(20, { message: "Password must not be more characters" })


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: 'Invalid email address' }),
    password: passwordValidation
});