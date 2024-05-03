import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";


export async function DELETE(
    request: Request,
    { params }: { params: { messageId: String } }
) {
    const messageId = params.messageId;
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
        try {
            const updatedResult = await UserModel.updateOne(
                { _id: user._id },
                {
                    $pull: {
                        messages: { _id: messageId }
                    }
                }
            );
            if (updatedResult.modifiedCount == 0) {
                return Response.json(
                    {
                        success: false,
                        message: "Message not found or already deleted"
                    },
                    {
                        status: 401
                    }
                );
            } else {
                return Response.json(
                    {
                        success: true,
                        message: "Message deleted"
                    },
                    {
                        status: 200
                    }
                );
            };
        } catch (error) {
            console.error('Error in deleting messages', error);
            return Response.json(
                {
                    success: false,
                    message: "Error deleting messages"
                },
                {
                    status: 500
                }
            );
        };
    };
};