import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getDb } from "./mongodb";
import type { User, AuthUser, CreateUserData, LoginData } from "./models/User";
import type { Session, SessionData } from "./models/Session";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

const COOKIE_NAME = "krishna_session";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
};

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create a JWT token
 */
export async function createToken(payload: {
  userId: string;
  email: string;
  name: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Verify a JWT token
 */
export async function verifyToken(
  token: string
): Promise<{ userId: string; email: string; name: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserData): Promise<User> {
  const db = await getDb();

  // Check if user already exists
  const existingUser = await db
    .collection<User>("users")
    .findOne({ email: data.email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const passwordHash = await hashPassword(data.password);
  const now = new Date();

  const user: User = {
    email: data.email,
    password_hash: passwordHash,
    name: data.name,
    created_at: now,
    updated_at: now,
  };

  const result = await db.collection<User>("users").insertOne(user);
  return {
    ...user,
    _id: result.insertedId.toString(),
  };
}

/**
 * Authenticate a user
 */
export async function authenticateUser(data: LoginData): Promise<User | null> {
  const db = await getDb();

  const user = await db
    .collection<User>("users")
    .findOne({ email: data.email });
  if (!user) {
    return null;
  }

  const isValidPassword = await verifyPassword(
    data.password,
    user.password_hash
  );
  if (!isValidPassword) {
    return null;
  }

  return user;
}

/**
 * Create a session
 */
export async function createSession(userId: string): Promise<Session> {
  const db = await getDb();

  const sessionId = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  const session: Session = {
    session_id: sessionId,
    user_id: userId,
    expires_at: expiresAt,
    created_at: new Date(),
  };

  await db.collection<Session>("sessions").insertOne(session);
  return session;
}

/**
 * Get session by ID
 */
export async function getSession(sessionId: string): Promise<Session | null> {
  const db = await getDb();

  const session = await db.collection<Session>("sessions").findOne({
    session_id: sessionId,
    expires_at: { $gt: new Date() },
  });

  return session || null;
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const db = await getDb();
  await db.collection<Session>("sessions").deleteOne({ session_id: sessionId });
}

/**
 * Get current authenticated user from request
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);

    if (!sessionCookie) {
      return null;
    }

    const session = await getSession(sessionCookie.value);
    if (!session) {
      return null;
    }

    const db = await getDb();
    const user = await db
      .collection<User>("users")
      .findOne({ _id: session.user_id });

    if (!user) {
      return null;
    }

    return {
      id: user._id!.toString(),
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Set session cookie
 */
export async function setSessionCookie(sessionId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, sessionId, COOKIE_OPTIONS);
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Require authentication middleware
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}
