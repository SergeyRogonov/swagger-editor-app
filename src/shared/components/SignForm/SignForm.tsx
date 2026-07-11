interface IPropsSignForm {
  title: string;
  subTitle: string;
  children: React.ReactNode;
}

export default function SignForm(props: IPropsSignForm) {
  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-lg border border-overlay bg-elevated p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary">
            {props.title}
          </h1>
          <p className="mt-2 text-text-muted">{props.subTitle}</p>
        </div>
        {props.children}
      </div>
    </main>
  );
}
