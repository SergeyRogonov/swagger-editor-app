import bcrypt from "bcrypt";

export async function generateHashPassword(password: string): Promise<string> {
  const SALT_ROUNDS = 10;
  const SALT = await bcrypt.genSalt(SALT_ROUNDS);
  const HASHED_PASSWORD = await bcrypt.hash(password, SALT);
  return HASHED_PASSWORD;
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const IS_MATCH = await bcrypt.compare(password, hashedPassword);
  return IS_MATCH;
}
