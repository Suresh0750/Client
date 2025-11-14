
import { cookies } from 'next/headers'
import { SignJWT } from "jose";
import { NEXT_PUBLIC_TOKEN } from '@/lib/server/environment';

export const RefreshToken = ()=>{
    const cookieStore = cookies()
    console.log(`Request reached RefreshToken`)

    console.log(cookieStore)
}

/**
 * Creates a JWT token for OTP verification
 * This function creates a token using the same secret and encoding method as the verification
 * 
 * IMPORTANT: The secret and encoding must match exactly with the verification in routes.ts
 * 
 * @param payload - The data to encode in the token (e.g., { userId: string })
 * @returns The signed JWT token string
 */
export async function createOtpToken(payload: { userId: string }): Promise<string> {
    const secret = NEXT_PUBLIC_TOKEN;

    if (!secret) {
        throw new Error("JWT secret not found in env");
    }

    try {
        // Create token with HS256 algorithm (same as verification expects)
        // Use TextEncoder().encode() to match the verification method exactly
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('10m') // Token expires in 10 minutes
            .sign(new TextEncoder().encode(secret));

        return token;
    } catch (error: any) {
        console.error('Failed to create OTP token:', error.message);
        throw error;
    }
}