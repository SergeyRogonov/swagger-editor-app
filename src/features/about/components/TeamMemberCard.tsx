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
    <article className="flex flex-col rounded-xl border border-overlay bg-surface p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{name}</h3>
          <p className="text-sm text-text-secondary">{role}</p>
        </div>
      </div>

      <div className="mt-auto text-text-secondary">
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
