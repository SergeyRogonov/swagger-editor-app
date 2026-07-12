interface IPropsFormSuccessMessage {
  message: null | string;
}

export default function FormSuccessMessage(props: IPropsFormSuccessMessage) {
  if (!props.message) {
    return null;
  }

  return (
    <div className="mb-6 rounded-lg border border-green-400/40 bg-green-500/10 p-4 text-sm text-green-500">
      {props.message}
    </div>
  );
}
