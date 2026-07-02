import { FieldError } from "react-hook-form";

interface IPropsReactHookFormError {
  error?: FieldError;
}

export default function ReactHookFormError(props: IPropsReactHookFormError) {
  if (!props.error) {
    return null;
  }

  return (
    <div className="relative mt-1 pt-1 pb-1">
      <div className="absolute text-red-500 text-sm animate-pulse">
        <span>{props.error.message}</span>
      </div>
    </div>
  );
}
