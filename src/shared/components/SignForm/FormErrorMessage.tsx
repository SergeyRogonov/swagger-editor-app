interface IPropsFormErrorMessage {
  message: null | string;
}

export default function FormErrorMessage(props: IPropsFormErrorMessage) {
  if (!props.message) {
    return null;
  }

  return (
    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
      {props.message}
    </div>
  );
}
