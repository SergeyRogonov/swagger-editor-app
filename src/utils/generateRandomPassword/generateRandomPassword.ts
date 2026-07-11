export default function generateRandomPassword() {
  const LETTERS_U = "QWERTYUIOPASDFGHJKLZXCVBNM";
  const LETTERS_L = "qwertyuiopasdfghjklzxcvbnm";
  const DIGITS = "0123456789";
  const SPEC_SYMBOLS = "!@#$%^&*()_=/*-";

  let randomPassword = "";

  randomPassword += LETTERS_U[Math.floor(Math.random() * LETTERS_U.length)];
  randomPassword += LETTERS_L[Math.floor(Math.random() * LETTERS_L.length)];
  randomPassword += DIGITS[Math.floor(Math.random() * DIGITS.length)];
  randomPassword +=
    SPEC_SYMBOLS[Math.floor(Math.random() * SPEC_SYMBOLS.length)];

  const STR = `${LETTERS_U}${LETTERS_L}${DIGITS}`;
  for (let i = 0; i < 4; i++) {
    const RANDOM_INDEX = Math.floor(Math.random() * STR.length);
    const RANDOM_CHAR = STR[RANDOM_INDEX];
    randomPassword += RANDOM_CHAR;
  }

  return randomPassword;
}
