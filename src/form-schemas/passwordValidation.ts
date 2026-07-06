import * as yup from "yup";

const passwordValidation = yup
  .string()
  .required()
  .test({
    message: "1 number",
    test: (value) => /\p{Nd}/u.test(value),
  })
  .test({
    message: "1 uppercase",
    test: (value) => /\p{Lu}/u.test(value),
  })
  .test({
    message: "1 lowercase",
    test: (value) => /\p{Ll}/u.test(value),
  })
  .test({
    message: "1 special character",
    test: (value) => /[^\p{L}\p{Nd}]/u.test(value),
  })
  .min(8, "Minimum 8 characters");

export default passwordValidation;
