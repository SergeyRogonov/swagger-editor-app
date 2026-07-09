import TeamMemberCard from "./TeamMemberCard";
import { team } from "../data/team";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-4xl font-bold">{t("pageTitle")}</h1>

      <section className="mt-8 space-y-4">
        <p className="text-text-secondary leading-7">
          {t("overviewDescription")}
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">RS School</h2>

        <p className="text-text-secondary leading-7">
          {t("courseDescription")}
        </p>

        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sky-400 hover:underline"
        >
          {t("courseLinkText")} →
        </a>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">{t("team.title")}</h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {team.map((member) => (
            <TeamMemberCard
              key={member.id}
              name={t(`team.members.${member.id}.name`)}
              role={t(`team.members.${member.id}.role`)}
              github={member.github}
              githubUsername={member.id}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">{t("technologiesLabel")}</h2>

        <div className="mt-4 flex flex-wrap gap-3">
          {[
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Supabase",
            "Monaco Editor",
            "Swagger Parser",
            "OpenAPI 3",
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-elevated px-4 py-2 text-sm text-text-primary"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-2xl font-semibold">{t("resourcesLabel")}</h2>

        <ul className="list-disc space-y-2 pl-5 text-text-secondary">
          <li>
            <a
              href="https://rs.school/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline"
            >
              RS School
            </a>
          </li>

          <li>
            <a
              href="https://swagger.io/specification/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline"
            >
              OpenAPI Specification
            </a>
          </li>

          <li>
            <a
              href="https://github.com/OAI/OpenAPI-Specification"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline"
            >
              OpenAPI GitHub Repository
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
