interface IPropsFormErrorMessage {
  message: null | string;
}

export default function FormErrorMessage(props: IPropsFormErrorMessage) {
  if (!props.message) {
    return null;
  }

  return (
    <div className="mb-6 rounded-lg border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-500">
      {props.message}
    </div>
  );
}
