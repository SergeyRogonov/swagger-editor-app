interface TeamMemberCardProps {
  name: string;
  role: string;
  github: string;
  githubUsername: string;
}

export default function TeamMemberCard({
  name,
  role,
  github,
  githubUsername,
}: TeamMemberCardProps) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-sm text-slate-400">{role}</p>
        </div>
      </div>

      <div className="mt-auto">
        GitHub:{" "}
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 hover:underline"
        >
          {githubUsername}
        </a>
      </div>
    </article>
  );
}
