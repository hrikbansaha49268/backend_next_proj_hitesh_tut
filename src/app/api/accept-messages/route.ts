import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user;
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthenticated user"
            },
            { status: 401 }
        );
    } else {
        const userId = user?._id;
        const { acceptMessages } = await request.json();
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                { isAcceptingMessage: acceptMessages },
                { new: true }
            );
            if (!updatedUser) {
                return Response.json(
                    {
                        success: false,
                        message: "User not found"
                    },
                    { status: 401 }
                );
            } else {
                return Response.json(
                    {
                        success: true,
                        message: "User ticked for message acceptance",
                        updatedUser
                    },
                    { status: 200 }
                );
            };
        } catch (error) {
            console.error('Failed to update user status', error);
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user status"
                },
                {
                    status: 500
                }
            );
        };
    };
};

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user;
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthenticated user"
            },
            { status: 401 }
        );
    } else {
        const userId = user?._id;
        try {
            const gotUser = await UserModel.findById(userId);
            if (!gotUser) {
                return Response.json(
                    {
                        success: false,
                        message: "User not found"
                    },
                    { status: 404 }
                );
            } else {
                return Response.json(
                    {
                        success: true,
                        message: "User ticked for message acceptance",
                        isAcceptingMessage: gotUser.isAcceptingMessage
                    },
                    { status: 200 }
                );
            };
        } catch (error) {
            console.error('Error in getting user message acceptance status', error);
            return Response.json(
                {
                    success: false,
                    message: "Error in getting user message acceptance status"
                },
                {
                    status: 500
                }
            );
        }
    };
};