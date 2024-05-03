import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";


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
        const userId = new mongoose.Types.ObjectId(user._id);
        try {
            const userMessages = await UserModel.aggregate([
                { $match: { _id: userId } },
                { $unwind: '$messages' },
                { $sort: { '$messages.createdAt': -1 } },
                { $group: { _id: '$_id', messages: { $push: '$messages' } } }
            ]);
            if (!userMessages || userMessages.length === 0) {
                return Response.json(
                    {
                        success: false,
                        message: "There are no messages"
                    },
                    { status: 404 }
                );
            } else {
                return Response.json(
                    {
                        success: true,
                        message: "User ticked for message acceptance",
                        messages: userMessages[0].messages
                    },
                    { status: 200 }
                );
            };
        } catch (error) {
            console.error('Error in getting user messages', error);
            return Response.json(
                {
                    success: false,
                    message: "Error in getting user messages"
                },
                {
                    status: 500
                }
            );
        };
    };
};