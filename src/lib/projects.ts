export type Project = {
  title: string
  description: string
  image: string
  tech: string[]
  repo?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    title: "Serendipity Scheduling App",
    description:
      "A centralized scheduling web app and API for managing staff shifts and trainings for a Roblox roleplay group.",
    repo: "https://github.com/xalonious/serendipity-scheduling-app",
    image: "/projects/serendipity.png",
    tech: ["TypeScript", "React", "Node.js", "Express", "Tailwind", "Prisma", "MySQL"],
    featured: true,
  },
  {
    title: "Serendipity Assistant",
    description:
      "A general purpose Discord bot featuring moderation tools, fun/community commands, and automation utilities.",
    repo: "https://github.com/xalonious/serendipity-assistant",
    image: "/projects/serendipity-assistant.png",
    tech: ["JavaScript", "Node.js", "MongoDB"],
  },
  {
    title: "Streaming App",
    description:
      "A self-hosted media streaming web app for discovering and playing movies and TV shows from user-configured sources.",
    repo: "https://github.com/xalonious/streaming-app",
    image: "/projects/streamingapp.png",
    tech: ["TypeScript", "React", "Node.js", "Express", "Tailwind"],
    featured: true,
  },
  {
    title: "xanderGPT",
    description:
      "A ChatGPT-style web app powered by a local LLM via Ollama, featuring real-time streaming responses, persistent conversations & web search.",
    repo: "https://github.com/xalonious/xanderGPT",
    image: "/projects/xandergpt.png",
    tech: ["TypeScript", "React", "Node.js", "Express", "Tailwind", "Prisma", "MySQL"],
    featured: true,
  },
  {
    title: "Barber App",
    description:
      "A full-stack appointment booking app where users can schedule barber appointments through a clean, responsive interface.",
    repo: "https://github.com/xalonious/barber-app",
    image: "/projects/barber.png",
    tech: ["TypeScript", "React", "Node.js", "Bootstrap", "Express", "MySQL"],
  },
  {
    title: "My Portfolio Website",
    description:
      "The site you're on. built with Next.js and Tailwind CSS. Showcases my projects, skills, and journey as a developer.",
    repo: "https://github.com/xalonious/portfolio",
    image: "/projects/portfolio.png",
    tech: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "My SSH Portfolio",
    description:
      "An SSH accessible terminal version of my portfolio, built as a keyboard driven TUI with Go, Bubble Tea, Lip Gloss, and Wish",
    repo: "https://github.com/xalonious/portfolio-a-la-ssh",
    image: "/projects/ssh-portfolio.png",
    tech: ["Go"],
  },
  {
    title: "Robux Spent Calculator",
    description:
      "An Electron desktop app that tracks Robux inflow, outflow, and current balance, with charts and spending insights.",
    repo: "https://github.com/xalonious/robux-spent",
    image: "/projects/robuxspent.png",
    tech: ["JavaScript", "Node.js", "Electron", "HTML", "CSS"],
  },
  {
    title: "Statuswatch",
    description:
      "A self-hosted Go service that monitors third-party status pages and fires Discord webhook alerts for new incidents, updates, and resolutions.",
    repo: "https://github.com/xalonious/statuswatch",
    image: "/projects/statuswatch.png",
    tech: ["Go"],
  },
]

export const featuredProjects = projects.filter((project) => project.featured)
