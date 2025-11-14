import { NextRequest, NextResponse } from 'next/server';
import { createOtpToken } from '@/jwtService';
import { jwtVerify } from "jose";
import { NEXT_PUBLIC_TOKEN } from '@/lib/server/environment';

/**
 * API route to create and set OTP token cookie
 * This should be called after user signup to protect the OTP page
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'UserId is required' },
                { status: 400 }
            );
        }

        // Create the token
        const token = await createOtpToken({ userId });

        // Verify the token was created correctly (for debugging)
        try {
            const secret = NEXT_PUBLIC_TOKEN;
            const { payload } = await jwtVerify(
                token,
                new TextEncoder().encode(secret)
            );
            console.log('Token created and verified successfully:', payload);
        } catch (verifyError: any) {
            console.error('Token verification failed after creation:', verifyError.message);
            // This should never happen, but log it if it does
        }

        // Create response
        const response = NextResponse.json({
            success: true,
            message: 'Token created successfully',
        });

        // Set the token as a cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 10, // 10 minutes
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Error creating OTP token:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to create token' },
            { status: 500 }
        );
    }
}
