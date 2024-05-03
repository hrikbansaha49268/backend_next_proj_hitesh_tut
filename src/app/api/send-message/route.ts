import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/user.model";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            );
        } else {
            if (!user.isAcceptingMessage) {
                return Response.json(
                    {
                        success: false,
                        message: "User is not accepting messages"
                    },
                    { status: 403 }
                );
            } else {
                const newMessage = { content, createdAt: new Date() };
                user.messages.push(newMessage as Message);
                await user.save();

                return Response.json(
                    {
                        success: true,
                        messages: "Message delivered succesfully"
                    },
                    { status: 200 }
                );
            };
        };
    } catch (error) {
        console.error('An unexpected error occured: ', error);
        return Response.json(
            {
                success: false,
                message: "An unexpected error occured"
            },
            {
                status: 500
            }
        );
    };
};