import * as yup from "yup";
import emailValidation from "./emailValidation";
import passwordValidation from "./passwordValidation";

export function getFormSchema() {
  return yup.object({
    email: emailValidation,
    password: passwordValidation,
  });
}
