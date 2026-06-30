import { SignJWT } from "jose";

const SECRET_STRING_KEY = process.env.JWT_SECRET || "secret";
const JWT_KEY = new TextEncoder().encode(SECRET_STRING_KEY);
const JWT_ALGORITHM: string = 'HS256';

interface IUserJwtData {
  email: string;
  name: string;
}

interface ISessionJwtPayload {
  data: IUserJwtData; // данные (не обязательно в поле data)
  iat?: number; // UNIX дата и время создания токена (issued at)
  exp?: number; // UNIX дата и время просрочки токена (expiration time)
  [key: string]: unknown; // данные (не обязательно в поле data)
}

/**
 *
 * @param payload
 *
 * Пусть у нас есть payload, тогда функция encrypt(payload) создает строковый JWT.
 *
 * - JWT состоит из трех частей: "алгоритм.данные.ключ". Расшифровку JWT ("aaa.ddd.kkk") можно смотреть на jwt.io.
 *  - aaa - алгоримт
 *      ```
 *      {
 *           alg: "HS256"
 *      }
 *      ```
 *  - ddd - данные c exp и iat
 *      ```
 *      {
 *           data: { email: "pavel@example.local", "name": "Pavel" },
 *           exp: 1782781111,
 *           iat: 1782781101
 *      }
 *      ```
 *  - kkk - хэш, который нужен для проверки, что токен не подделан, например, через jwt.io
 *
 * @returns jwt - токен формата "aaa.ddd.kkk"
 */
export async function encrypt(payload: ISessionJwtPayload): Promise<string> {
  const JWT = await new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(JWT_KEY);
  return JWT;
}
