import { SendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        const existingUserVerified = await UserModel.findOne({ username, isVerified: true });
        if (existingUserVerified) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {
                    status: 400
                }
            );
        };
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // This algorithm is used for generating OTP
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with the email"
                    },
                    {
                        status: 500
                    }
                );
            } else {
                const hashesPass = bcrypt.hashSync(password, 10);
                existingUserByEmail.password = hashesPass;
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);
                existingUserByEmail.verifyCodeExpiry = expiryDate;
                existingUserByEmail.verifyCode = verifyCode;
                await existingUserByEmail.save();
            };
        } else {
            const hashesPass = bcrypt.hashSync(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hashesPass,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false
            });
            await newUser.save();
        };
        const emailResponse = await SendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 500
                }
            );
        } else {
            return Response.json(
                {
                    success: true,
                    message: "User registered succesfully"
                },
                {
                    status: 201
                }
            );
        };
    } catch (error) {
        console.error('Error registering the user', error);
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        );
    };
};