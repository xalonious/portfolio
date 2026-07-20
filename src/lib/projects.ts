export type CaseStudySectionType =
  | "overview"
  | "context"
  | "role"
  | "architecture"
  | "features"
  | "challenge"
  | "decisions"
  | "learnings"
  | "improvements"

export type CaseStudyImage = {
  src: string
  alt: string
  caption?: string
  width: number
  height: number
  layout?: "wide" | "inset"
  lightboxSize?: "compact" | "standard" | "wide"
}

export type CaseStudySection = {
  type: CaseStudySectionType
  eyebrow?: string
  title: string
  paragraphs: string[]
  highlights?: string[]
  images?: CaseStudyImage[]
}

export type CaseStudy = {
  role?: string
  year?: string
  status?: string
  sections: CaseStudySection[]
}

type ProjectBase = {
  title: string
  description: string
  image: string
  imageAlt?: string
  imageLayout?: "portrait" | "landscape"
  tech: string[]
  repo?: string
  live?: string
  featured?: boolean
}

export type ProjectWithCaseStudy = ProjectBase & {
  slug: string
  imageAlt: string
  caseStudy: CaseStudy
}

export type ProjectWithoutCaseStudy = ProjectBase & {
  slug?: never
  caseStudy?: never
}

export type Project = ProjectWithCaseStudy | ProjectWithoutCaseStudy

export const projects: Project[] = [
  {
    title: "Serendipity Scheduling App",
    slug: "serendipity-scheduling-app",
    description:
      "A centralized scheduling web app and API for managing staff shifts and training sessions for a Roblox roleplay group.",
    repo: "https://github.com/xalonious/serendipity-scheduling-app",
    image: "/projects/serendipity.png",
    imageAlt:
      "Winter-themed anime character used as artwork for the Serendipity Scheduling App",
    imageLayout: "portrait",
    tech: [
      "TypeScript",
      "React",
      "Node.js",
      "Express",
      "Tailwind",
      "Prisma",
      "MySQL",
    ],
    featured: true,
    caseStudy: {
      role: "Sole developer",
      year: "2025",
      status: "In active use",
      sections: [
        {
          type: "context",
          eyebrow: "Context",
          title: "Replacing announcements and spreadsheets with one schedule",
          paragraphs: [
            "Serendipity Support Center is a Roblox therapy roleplay group where staff host shifts and scheduled training sessions. Before the app, there was no central schedule for shifts, so members often only knew one was happening after it had been announced. Training sessions were claimed by entering a username into a shared spreadsheet.",
            "That workflow was easy to overwrite and depended on a high-ranking staff member manually resetting the spreadsheet each week. I built a single place where staff could create shifts or claim fixed training slots, while other members could see what was scheduled and when.",
          ],
        },
        {
          type: "architecture",
          eyebrow: "The system",
          title: "One backend for the website and Roblox",
          paragraphs: [
            "The system paired a React frontend with an Express API backed by Prisma and MySQL, all hosted on a VPS. Staff signed in through Roblox OAuth 2.0, and their Roblox profile and group rank determined which scheduling actions they were allowed to perform.",
            "Roblox game servers also communicated with the API over HTTP using an API key. This allowed scheduled and ongoing sessions to appear in-game, while the same backend supported smaller group features such as special nametags, rotating staff tips, and permission checks.",
          ],
        },
        {
          type: "features",
          eyebrow: "Interface",
          title: "Scheduling in practice",
          paragraphs: [
            "Members could use the weekly schedule to see upcoming sessions at a glance. Staff could create a shift by choosing its date and time range, then review the calculated reward before confirming it.",
          ],
          images: [
            {
              src: "/casestudies/serendipity/shifts.png",
              alt: "Serendipity weekly shift schedule with claimed sessions arranged across seven days",
              caption: "The weekly shift schedule gives members one place to see upcoming sessions.",
              width: 1553,
              height: 659,
            },
            {
              src: "/casestudies/serendipity/modal.png",
              alt: "Create Shift form with date and time fields and an estimated reward of 8 Robux",
              caption: "Staff choose a date and time range, then see the calculated reward before creating a shift.",
              width: 418,
              height: 333,
              layout: "inset",
              lightboxSize: "compact",
            },
          ],
        },
        {
          type: "challenge",
          eyebrow: "Main technical challenge",
          title: "Rewarding the hours that needed hosts",
          paragraphs: [
            "When a staff member created a shift, the app calculated and displayed its Robux reward. Instead of assigning a fixed amount, I built a historical scoring model so that less frequently hosted time periods produced a higher reward.",
            "The backend grouped previous shifts by time of week, weighted recent history more heavily, and combined the relevant periods when a shift crossed multiple time slots. The resulting score was mapped to a bounded Robux reward, with less frequently covered periods receiving stronger incentives.",
            "The system also used a predictable fallback before enough history existed and applied the final result within the app's validation rules and weekly reward limits.",
            "Designing that calculation was the hardest part of the project. It had to turn incomplete historical activity into an incentive that was useful to staff without making rewards unpredictable or disproportionately expensive.",
          ],
        },
        {
          type: "decisions",
          eyebrow: "Automation",
          title: "Removing the weekly maintenance work",
          paragraphs: [
            "Scheduled jobs archived completed shifts into the history used by future reward calculations, removed expired shift records, and regenerated the fixed training slots for the new week.",
            "This removed the need for a high-ranking staff member to reset the spreadsheet manually each week and preserved completed scheduling data instead of discarding it.",
          ],
        },
        {
          type: "learnings",
          eyebrow: "What I learned",
          title: "Turning historical behavior into a useful signal",
          paragraphs: [
            "Building the reward system taught me how to turn incomplete historical activity into a practical scoring model. I had to structure past behavior, account for recency and limited data, define predictable fallback behavior, and keep the result useful within a real workflow.",
            "It also reinforced that a technically correct calculation is not enough on its own. The output had to be understandable, bounded, and consistent enough for staff to trust and act on.",
          ],
        },
      ],
    },
  },
  {
    title: "Streaming App",
    slug: "streaming-app",
    description:
      "A self-hosted media streaming web app for discovering and playing movies and TV shows from user-configured sources.",
    repo: "https://github.com/xalonious/streaming-app",
    image: "/projects/streamingapp.png",
    imageAlt: "Streaming App interface showing featured and trending titles",
    tech: ["TypeScript", "React", "Node.js", "Express", "Tailwind"],
    featured: true,
    caseStudy: {
      role: "Sole developer",
      year: "2026",
      status: "In active use",
      sections: [
        {
          type: "context",
          eyebrow: "Context",
          title: "A streaming experience I could control",
          paragraphs: [
            "I was tired of repeatedly searching for third-party streaming sites that would disappear, become overloaded with ads, or offer an inconsistent experience. Instead of replacing one temporary site with another, I decided to build a personal interface that I could control.",
            "The result is a self-hosted app for discovering and watching movies and TV shows through one consistent browsing experience, while keeping the playback provider separate from the interface itself.",
          ],
        },
        {
          type: "architecture",
          eyebrow: "The system",
          title: "Separating metadata, playback, and the interface",
          paragraphs: [
            "The React and Vite frontend handles the complete browsing experience, while a focused Express API acts as a bridge to TMDB. Keeping those requests on the server protects the TMDB key and gives the frontend normalized data for search, artwork, cast information, trailers, seasons, episodes, collections, and recommendations.",
            "Playback is provider-neutral. The backend generates movie and episode embed URLs from a single STREAM_SOURCE environment variable, which means I can replace a provider that stops working without rewriting the frontend.",
            "The app does not download, store, or proxy video files. Its responsibility is to provide the discovery interface, normalize metadata, and connect the selected title to the configured playback source.",
          ],
        },
        {
          type: "features",
          eyebrow: "Interface",
          title: "A desktop-first browsing experience",
          paragraphs: [
            "The home screen uses a full-width featured title and artwork-led content rows to make discovery feel closer to a dedicated streaming service than a collection of external links.",
          ],
          images: [
            {
              src: "/casestudies/streamingapp/home.png",
              alt: "Streaming App home screen featuring The Odyssey above a row of popular titles",
              caption: "The home screen leads with a featured title before moving into ranked discovery rows.",
              width: 1898,
              height: 921,
            },
          ],
        },
        {
          type: "challenge",
          eyebrow: "Main challenge",
          title: "Making a content-heavy interface feel cinematic",
          paragraphs: [
            "The external integrations were intentionally straightforward; most of the work went into making the app feel cohesive and polished. I built an artwork-led home page, discovery rows, search, detailed title and actor pages, season and episode browsing, trailers, recommendations, and a full-screen player as one connected experience.",
            "The challenge was less about one difficult algorithm and more about maintaining a clear visual hierarchy across a large amount of content. Artwork came in different shapes, titles varied in length, metadata could become dense, and each screen still had to remain usable across desktop and smaller displays.",
            "That meant treating spacing, typography, image sizing, navigation depth, responsive rows, and player transitions as parts of the same system rather than polishing each screen in isolation.",
          ],
          images: [
            {
              src: "/casestudies/streamingapp/details.png",
              alt: "Streaming App details page for Mr. Robot with metadata, trailer controls, season selection, and episodes",
              caption: "Title pages bring metadata, trailers, season controls, and episode browsing into the same artwork-led layout.",
              width: 1904,
              height: 916,
            },
          ],
        },
        {
          type: "decisions",
          eyebrow: "Deployment",
          title: "Private and self-hosted",
          paragraphs: [
            "The app runs on a Raspberry Pi behind a firewall and is limited through network access rules to my own use. That keeps the deployment private while giving me direct control over the application, its configuration, and the selected playback provider.",
            "Self-hosting also made the project a practical part of my own setup rather than only a local development exercise.",
          ],
        },
        {
          type: "learnings",
          eyebrow: "What I learned",
          title: "Polish comes from consistent decisions",
          paragraphs: [
            "Building the app taught me that polish in a media interface comes from consistency across many small decisions: artwork sizing, text contrast, loading behavior, responsive rows, navigation depth, and keeping controls understandable as the amount of content grows.",
            "It also helped me get better at using visual hierarchy to guide attention without allowing artwork or metadata to overwhelm the interface. The experience had to feel cinematic, but it still needed to remain clear, predictable, and easy to browse.",
          ],
        },
      ],
    },
  },
  {
    title: "xanderGPT",
    slug: "xandergpt",
    description:
      "A ChatGPT-style web app powered by a local LLM through Ollama, featuring real-time streamed responses, persistent conversations, and web search.",
    repo: "https://github.com/xalonious/xanderGPT",
    image: "/projects/xandergpt.png",
    imageAlt: "xanderGPT welcome screen with its logo and new-chat prompt",
    tech: [
      "TypeScript",
      "React",
      "Node.js",
      "Express",
      "Tailwind",
      "Prisma",
      "MySQL",
      "Ollama",
    ],
    featured: true,
    caseStudy: {
      role: "Sole developer",
      year: "2026",
      status: "Local prototype",
      sections: [
        {
          type: "context",
          eyebrow: "Context",
          title: "Learning what sits behind an AI chat interface",
          paragraphs: [
            "xanderGPT did not begin with a problem I needed to solve. I wanted to find out how difficult it would be to build my own ChatGPT-style application and understand how the interface, model, conversation state, and external tools fit together.",
            "I treated it as a local prototype rather than a production product, focusing on recreating the parts of an AI chat experience that users normally take for granted.",
          ],
        },
        {
          type: "architecture",
          eyebrow: "The system",
          title: "A local model with persistent conversations",
          paragraphs: [
            "The React frontend communicates with an Express API that sends prompts to a local qwen2.5:7b model through Ollama. I chose that model because it was capable enough for the experiment while still running comfortably on my RTX 3070.",
            "Prisma and MySQL store accounts, conversations, messages, and per-chat system prompts. The backend streams generated tokens to the browser, supports cancellable responses, creates automatic conversation titles, and also offers temporary chats that are not written to the database.",
          ],
          images: [
            {
              src: "/casestudies/xandergpt/chat.png",
              alt: "xanderGPT desktop chat interface with conversation history and a streamed response containing formatted text and TypeScript code",
              caption: "The desktop interface brings persistent conversation history, streamed responses, and rich content rendering into one chat experience.",
              width: 2557,
              height: 1272,
            },
          ],
        },
        {
          type: "features",
          eyebrow: "Tool orchestration",
          title: "Connecting the model to useful tools",
          paragraphs: [
            "Before generating an answer, the backend can ask the model whether it should use a calculator or search the web. Mathematical expressions are evaluated separately, Brave Search provides web results, and URLs included in a prompt can be fetched and reduced to readable page content before being added to the model's context.",
            "Building this flow taught me how an assistant can coordinate several specialized tools instead of expecting the language model to handle every task by itself.",
          ],
          images: [
            {
              src: "/casestudies/xandergpt/search.png",
              alt: "xanderGPT answer comparing Prisma and Drizzle with five web search sources shown beneath it",
              caption: "Web search results are added to the model's context and exposed beneath the generated answer.",
              width: 1015,
              height: 886,
              layout: "inset",
              lightboxSize: "standard",
            },
          ],
        },
        {
          type: "challenge",
          eyebrow: "Main technical challenge",
          title: "Reliable web search is more than an API call",
          paragraphs: [
            "The difficult part was not sending a query to a search API; it was finding results that were relevant and trustworthy enough to support an answer. The implementation lets the model decide when to search, evaluates whether it needs more results, and adds Brave Search snippets to the final prompt.",
            "That still leaves a fragile handoff between retrieval and generation. Search results can be incomplete or poorly matched, and the model may rely on its existing knowledge when that conflicts with the retrieved information. The result can sound confident while still being wrong, which made web search the clearest limitation of the prototype.",
          ],
        },
        {
          type: "improvements",
          eyebrow: "What I would improve",
          title: "Build the answer around evidence",
          paragraphs: [
            "A stronger version would treat search as a retrieval pipeline rather than passing result snippets directly to the model. I would fetch the most promising pages, prioritize primary and reputable sources, extract only the passages relevant to the question, compare evidence across multiple sources, and require the final answer to cite the material it actually used.",
            "I would also make conflicts and weak evidence explicit instead of asking the model to resolve them silently. That would make the system easier to evaluate and reduce the chance that prior model knowledge overrides fresher information.",
          ],
        },
        {
          type: "learnings",
          eyebrow: "What I learned",
          title: "Tool use depends on the quality of the handoff",
          paragraphs: [
            "The project gave me a practical understanding of tool orchestration and showed me that adding a tool is only the first step. The difficult work is deciding when to use it, selecting useful context, and making sure the model stays grounded in what the tool returned.",
          ],
        },
      ],
    },
  },
  {
    title: "Bridgely",
    description:
      "A Discord-to-Roblox verification bot with profile and game-based verification, automatic group role and nickname synchronization, and configurable rank, badge, and game-pass role binds.",
    repo: "https://github.com/xalonious/Bridgely",
    image: "/projects/bridgely.png",
    tech: ["JavaScript", "Node.js", "Discord.js", "Express", "MongoDB", "Luau"],
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
      "The site you're on, built with Next.js and Tailwind CSS to showcase my projects, skills, and development journey.",
    repo: "https://github.com/xalonious/portfolio",
    image: "/projects/portfolio.png",
    tech: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "My SSH Portfolio",
    description:
      "An SSH-accessible terminal version of my portfolio, built as a keyboard-driven TUI with Go, Bubble Tea, Lip Gloss, and Wish.",
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
      "A self-hosted Go service that monitors third-party status pages and sends Discord webhook alerts for new incidents, updates, and resolutions.",
    repo: "https://github.com/xalonious/statuswatch",
    image: "/projects/statuswatch.png",
    tech: ["Go"],
  },
  {
    title: "Media Tool",
    description:
      "A cross-platform Python CLI for converting, compressing, and precisely cutting images, audio, and video, with batch processing and a project-local FFmpeg runtime.",
    repo: "https://github.com/xalonious/media_tool",
    image: "/projects/mediatool.png",
    tech: ["Python", "FFmpeg", "Pillow"],
  },
]

export const featuredProjects = projects.filter((project) => project.featured)

export function isProjectWithCaseStudy(
  project: Project,
): project is ProjectWithCaseStudy {
  return project.caseStudy !== undefined
}

export function getProjectBySlug(slug: string) {
  return getProjectsWithCaseStudies().find((project) => project.slug === slug)
}

export function getProjectsWithCaseStudies() {
  return projects.filter(isProjectWithCaseStudy)
}
