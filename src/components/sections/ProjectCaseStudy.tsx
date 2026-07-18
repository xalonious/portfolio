import Image from "next/image"
import { CaseStudyReveal } from "@/components/ui/CaseStudyReveal"
import { TransitionLink } from "@/components/ui/TransitionLink"
import type { CaseStudySection, ProjectWithCaseStudy } from "@/lib/projects"

const focusStyles =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[--primary]"

function hasContent(section: CaseStudySection) {
  return (
    section.paragraphs.some((paragraph) => paragraph.trim()) ||
    section.highlights?.some((highlight) => highlight.trim())
  )
}

function ExternalProjectLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2 text-sm font-medium text-[--foreground] underline decoration-[--border] underline-offset-4 transition-colors duration-200 hover:text-[--primary] hover:decoration-[--primary] ${focusStyles}`}
    >
      {children}
      <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </a>
  )
}

function ProjectImage({ project }: { project: ProjectWithCaseStudy }) {
  const isPortrait = project.imageLayout === "portrait"

  return (
    <figure
      className={
        isPortrait
          ? "mx-auto w-[min(100%,20rem)] overflow-hidden rounded-sm border border-[--border] bg-[--card] p-2 sm:w-[min(100%,26rem)] sm:p-3"
          : "relative mx-auto aspect-video w-full max-w-[60rem] overflow-hidden rounded-sm border border-[--border] bg-[--card]"
      }
    >
      {!isPortrait && (
        <>
          <Image
            src={project.image}
            alt=""
            fill
            aria-hidden="true"
            sizes="(min-width: 1024px) 470px, calc(100vw - 48px)"
            className="scale-105 object-cover opacity-25 blur-xl"
          />
          <div className="absolute inset-0 bg-[--background]/35" aria-hidden="true" />
        </>
      )}
      <div
        className={
          isPortrait ? "relative aspect-square w-full" : "absolute inset-3 sm:inset-5 lg:inset-7"
        }
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          priority
          sizes={
            isPortrait
              ? "(min-width: 640px) 392px, calc(100vw - 64px)"
              : "(min-width: 1024px) 420px, calc(100vw - 72px)"
          }
          className="object-contain"
        />
      </div>
    </figure>
  )
}

export function ProjectCaseStudy({ project }: { project: ProjectWithCaseStudy }) {
  const { caseStudy } = project
  const sections = caseStudy.sections.filter(hasContent)
  const metadata = [
    { label: "Role", value: caseStudy.role },
    { label: "Year", value: caseStudy.year },
    { label: "Status", value: caseStudy.status },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value))

  return (
    <div className="min-h-screen bg-[--background] text-[--foreground]">
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-28 sm:pb-32 sm:pt-32">
        <CaseStudyReveal>
          <nav aria-label="Project navigation" className="mb-10 sm:mb-12">
            <TransitionLink
              href="/projects"
              className={`inline-flex items-center gap-2 text-sm font-medium text-[--muted-foreground] transition-colors duration-200 hover:text-[--foreground] ${focusStyles}`}
            >
              <span aria-hidden="true">←</span>
              All projects
            </TransitionLink>
          </nav>

          <header>
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:gap-14">
              <div className="min-w-0">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[--primary]">
                  Case study
                </p>
                <h1 className="max-w-5xl font-display text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.95] tracking-tight text-[--foreground]">
                  {project.title}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[--muted-foreground] sm:text-xl">
                  {project.description}
                </p>
              </div>

              <ProjectImage project={project} />
            </div>

            <div className="mt-8 grid gap-8 border-y border-[--border] py-7 sm:mt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-12">
              <div>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[--primary]">
                  Technology
                </p>
                <ul className="flex flex-wrap gap-2" aria-label="Technologies used">
                  {project.tech.map((technology) => (
                    <li
                      key={technology}
                      className="rounded-sm border border-[--border] bg-[--card] px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wide text-[--muted-foreground]"
                    >
                      {technology}
                    </li>
                  ))}
                </ul>
              </div>

              {metadata.length > 0 && (
                <dl className="grid grid-cols-1 gap-x-8 gap-y-5 min-[420px]:grid-cols-2 sm:grid-cols-3">
                  {metadata.map((item) => (
                    <div key={item.label} className="min-w-24">
                      <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-[--primary]">
                        {item.label}
                      </dt>
                      <dd className="mt-1 text-sm text-[--foreground]">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {(project.repo || project.live) && (
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                {project.repo && (
                  <ExternalProjectLink href={project.repo}>View repository</ExternalProjectLink>
                )}
                {project.live && (
                  <ExternalProjectLink href={project.live}>View live project</ExternalProjectLink>
                )}
              </div>
            )}
          </header>

          <div
            className={`mx-auto max-w-3xl ${
              sections.length > 0 ? "mt-10 sm:mt-12" : "mt-8 sm:mt-10"
            }`}
          >
            {sections.length > 0 ? (
              <div className="space-y-20 sm:space-y-24">
                {sections.map((section, index) => {
                  const headingId = `${project.slug}-${section.type}-${index}`

                  return (
                    <section key={headingId} aria-labelledby={headingId}>
                      {section.eyebrow && (
                        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[--primary]">
                          {section.eyebrow}
                        </p>
                      )}
                      <h2
                        id={headingId}
                        className="font-display text-3xl font-bold leading-tight text-[--foreground] sm:text-4xl"
                      >
                        {section.title}
                      </h2>
                      <div className="mt-6 space-y-5 text-base leading-8 text-[--muted-foreground] sm:text-lg">
                        {section.paragraphs
                          .filter((paragraph) => paragraph.trim())
                          .map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                      </div>
                      {section.highlights && section.highlights.some((highlight) => highlight.trim()) && (
                        <ul className="mt-8 space-y-3 border-l border-[--primary] pl-6 text-base leading-relaxed text-[--foreground]">
                          {section.highlights
                            .filter((highlight) => highlight.trim())
                            .map((highlight) => (
                              <li key={highlight}>{highlight}</li>
                            ))}
                        </ul>
                      )}
                    </section>
                  )
                })}
              </div>
            ) : (
              <section
                aria-labelledby="case-study-status"
                className="border-y border-[--border] py-8 sm:py-10"
              >
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[--primary]">
                  Case study in progress
                </p>
                <h2
                  id="case-study-status"
                  className="mt-3 font-display text-3xl font-bold leading-tight text-[--foreground] sm:text-4xl"
                >
                  Detailed write-up coming soon
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[--muted-foreground] sm:text-lg">
                  The full technical breakdown, decisions, challenges, and lessons will be added
                  here later.
                </p>
              </section>
            )}
          </div>

          <nav
            aria-label="Project navigation"
            className={`border-t border-[--border] pt-8 ${
              sections.length > 0 ? "mt-20 sm:mt-28" : "mt-12 sm:mt-16"
            }`}
          >
            <TransitionLink
              href="/projects"
              className={`inline-flex items-center gap-2 text-sm font-medium text-[--muted-foreground] transition-colors duration-200 hover:text-[--foreground] ${focusStyles}`}
            >
              <span aria-hidden="true">←</span>
              Back to all projects
            </TransitionLink>
          </nav>
        </CaseStudyReveal>
      </main>
    </div>
  )
}
