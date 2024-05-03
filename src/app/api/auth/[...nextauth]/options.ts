import bcryptjs from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "jsmith@email.com"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { password: credentials.identifier }
                        ]
                    });
                    if (!user) {
                        throw new Error('No user found with this email');
                    } else {
                        if (!user.isVerified) {
                            throw new Error('Please verify your account first');
                        } else {
                            const passwordIsCorrect = bcryptjs.compareSync(credentials.password, user.password);
                            if (passwordIsCorrect) {
                                return user
                            } else {
                                throw new Error('Password is incorrect');
                            };
                        };
                    };
                } catch (error: any) {
                    throw new Error(error);
                };
            },
        })
    ],
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.SECRET_AUTH,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
            return session;
        }
    }
};