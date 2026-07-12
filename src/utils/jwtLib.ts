import { SignJWT, jwtVerify } from "jose";

const SECRET_STRING_KEY = process.env.JWT_SECRET || "secret";
const JWT_KEY = new TextEncoder().encode(SECRET_STRING_KEY);
const JWT_ALGORITHM: string = "HS256";

interface IUserJwtData {
  userId: number;
  type: "access" | "refresh";
}

interface ISessionJwtPayload {
  data: IUserJwtData;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export async function encrypt(payload: ISessionJwtPayload): Promise<string> {
  const JWT = await new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_KEY);
  return JWT;
}

export async function decrypt(stringJwt: string): Promise<ISessionJwtPayload> {
  const { payload } = await jwtVerify(stringJwt, JWT_KEY, {
    algorithms: [JWT_ALGORITHM],
  });
  return payload as ISessionJwtPayload;
}
