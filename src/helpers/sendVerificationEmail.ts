import { resend } from "@/lib/resend";
import VerificationEmailTemplate from "../../emailTemplates/VerificationEmail";
import { ApiResponse } from "@/types/Api.Response";

export async function SendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
):
    Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mysteryy Verification Code',
            react: VerificationEmailTemplate({ username, otp: verifyCode })
        });
        return { success: true, message: 'Verification email sent' };
    } catch (emailError) {
        return { success: false, message: 'Error sending verification email' };
    }
};