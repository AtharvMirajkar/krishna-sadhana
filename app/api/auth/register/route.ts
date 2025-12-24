import { NextRequest, NextResponse } from 'next/server';
import { createUser, createSession, setSessionCookie } from '@/lib/auth';
import type { CreateUserData } from '@/lib/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserData = await request.json();

    // Basic validation
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser(body);

    // Create session
    const session = await createSession(user._id!);

    // Set session cookie
    await setSessionCookie(session.session_id);

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof Error && error.message === 'User with this email already exists') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
