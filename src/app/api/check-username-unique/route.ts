import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        };
        const isUsernameOk = UsernameQuerySchema.safeParse(queryParam);
        if (!isUsernameOk.success) {
            const usernameErrors = isUsernameOk.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Username in incorrect format"
                },
                { status: 400 }
            );
        } else {
            const { username } = isUsernameOk.data;

            const existingVerifiedUser = await UserModel.findOne({ username });

            if (existingVerifiedUser) {
                return Response.json(
                    {
                        success: false,
                        message: "Username is already taken"
                    },
                    { status: 400 }
                );
            } else {
                return Response.json(
                    {
                        success: true,
                        message: "Username is available"
                    },
                    { status: 200 }
                );
            }
        };
    } catch (error) {
        console.error("Error checking username", error);
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            { status: 500 }
        );
    };
};