import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 500 }
            );
        } else {
            const isCodeValid = user.verifyCode === code;
            const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

            if (isCodeValid && isCodeNotExpired) {
                user.isVerified = true;
                await user.save({ validateBeforeSave: false });

                return Response.json(
                    {
                        success: true,
                        message: "User verified successfully"
                    },
                    { status: 200 }
                );
            } else if (!isCodeNotExpired) {
                return Response.json(
                    {
                        success: false,
                        message: "Verification code has expired. Please signup again"
                    },
                    { status: 400 }
                );
            } else {
                return Response.json(
                    {
                        success: true,
                        message: "Verification code is incorrect"
                    },
                    { status: 400 }
                );
            };

        };
    } catch (error) {
        console.error("Error verifying user", error);
        return Response.json(
            {
                success: false,
                message: "Error verifying user"
            },
            { status: 500 }
        );
    };
};