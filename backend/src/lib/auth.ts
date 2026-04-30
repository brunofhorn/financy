import jwt from "jsonwebtoken";

type TokenPayload = {
  sub: string;
  email: string;
};

export function signAccessToken(userId: string, email: string): string {
  return jwt.sign({ email }, getJwtSecret(), {
    subject: userId,
    expiresIn: "7d",
  });
}

export function getUserIdFromAuthHeader(
  authHeader?: string | null,
): string | null {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as TokenPayload;
    return decoded.sub ?? null;
  } catch {
    return null;
  }
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET não foi configurada.");
  }
  return secret;
}
