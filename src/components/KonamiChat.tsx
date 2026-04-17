"use client"

import { useEffect, useRef, useState } from "react"

const KONAMI = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a"
]

interface ChatMessage {
  from: "xander" | "you" | "claude"
  text: string
}

interface DialogueNode {
  xander: string
  claude?: string
  replies: { label: string; next: string; requires?: string }[]
}

const dialogue: Record<string, DialogueNode> = {
  start: {
    xander: "oh. you found it.",
    replies: [
      { label: "i know the code 😎",              next: "knows-code"       },
      { label: "i was just pressing buttons",     next: "accident"         },
      { label: "what even is this",               next: "what-is-this"     },
    ],
  },
  "knows-code": {
    xander: "respect. most people just scroll past and leave. you actually poked around.",
    replies: [
      { label: "did you vibe code this",          next: "vibe-code-direct" },
      { label: "why is there a rickroll in the nav", next: "rickroll"      },
      { label: "who's the cat",                   next: "cat-intro"        },
    ],
  },
  "accident": {
    xander: "sure you were. ↑↑↓↓←→←→BA doesn't just happen.",
    replies: [
      { label: "ok fine. what is this",           next: "what-is-this"     },
      { label: "i was testing my keyboard",       next: "keyboard"         },
    ],
  },
  "keyboard": {
    xander: "your keyboard test required the konami code. interesting QA process.",
    replies: [
      { label: "did you build this site yourself", next: "vibe-code-soft"  },
      { label: "why is there a cat on the homepage", next: "cat-intro"     },
    ],
  },
  "what-is-this": {
    xander: "an easter egg. you press the code, something happens. congrats, you won a conversation with me.",
    replies: [
      { label: "incredible prize",                next: "prize-sarcasm"    },
      { label: "did you build this yourself",     next: "vibe-code-soft"   },
      { label: "i want a refund",                 next: "refund"           },
    ],
  },
  "prize-sarcasm": {
    xander: "i can tell you're being sarcastic but i'm taking it genuinely. thank you.",
    replies: [
      { label: "ok it's actually pretty cool",    next: "pretty-cool"      },
      { label: "did you vibe code this",          next: "vibe-code-direct" },
    ],
  },
  "pretty-cool": {
    xander: "right? most sites just do confetti. i gave you actual conversation.",
    replies: [
      { label: "how long did this take to build", next: "how-long"         },
      { label: "did you build it yourself",       next: "vibe-code-soft"   },
    ],
  },
  "refund": {
    xander: "it was free. you can't refund free things. basic economics.",
    replies: [
      { label: "i want to speak to the manager",  next: "manager"          },
      { label: "fair point",                      next: "fair-point"       },
    ],
  },
  "fair-point": {
    xander: "exactly. anyway — feel free to poke around.",
    replies: [
      { label: "did you vibe code this",          next: "vibe-code-direct" },
      { label: "who's the cat on the homepage",   next: "cat-intro"        },
    ],
  },
  "manager": {
    xander: "i am the manager, developer, designer, devops, and cat owner. very flat org structure.",
    replies: [
      { label: "did you build all of this yourself", next: "vibe-code-soft" },
      { label: "tell me about the cat",           next: "cat-intro"        },
    ],
  },
  "vibe-code-direct": {
    xander: "nah man. wrote every single line myself. pure craft. no ai.",
    claude: "bro i literally wrote this entire site 💀",
    replies: [
      { label: "LMAOO claude just snitched",      next: "snitched"         },
      { label: "i knew it",                       next: "knew-it"          },
    ],
  },
  "vibe-code-soft": {
    xander: "yeah, built it myself. well... mostly.",
    claude: "mostly is generous. i wrote the whole thing.",
    replies: [
      { label: "wait what",                       next: "snitched"         },
      { label: "how collaborative are we talking", next: "claude-did"      },
    ],
  },
  "snitched": {
    xander: "claude has zero loyalty. i gave it a good prompt and this is how it repays me.",
    claude: "you said 'make it look less like AI slop'. i took that personally.",
    replies: [
      { label: "did it work though",              next: "did-it-work"      },
      { label: "how much did claude actually do", next: "claude-did"       },
    ],
  },
  "knew-it": {
    xander: "claude is a tool. a very opinionated tool that apparently talks back.",
    claude: "you're welcome for the discord status widget btw",
    replies: [
      { label: "that widget is genuinely sick",   next: "discord-widget"   },
      { label: "how much did claude actually do", next: "claude-did"       },
    ],
  },
  "did-it-work": {
    xander: "i mean... you're here. the site doesn't look like a bootstrap template. so yes.",
    replies: [
      { label: "what was the hardest part to build", next: "hardest-part"  },
      { label: "the tech stack section is cool",  next: "bubbles-entry"    },
    ],
  },
  "claude-did": {
    xander: "okay FINE. it was collaborative. i directed the vision. claude executed.",
    claude: "you changed the button colour 6 times and called it 'directing the vision'",
    replies: [
      { label: "what colour did you land on",     next: "palette-result"   },
      { label: "how many redesigns total",        next: "redesigns"        },
    ],
  },
  "redesigns": {
    xander: "the tech stack section alone had four lives. the palette went through five rounds.",
    replies: [
      { label: "four lives for the tech stack??", next: "hardest-part"     },
      { label: "five palettes??",                 next: "palette-result"   },
    ],
  },
  "how-long": {
    xander: "a few days of actual work. the conversation got so long it had to be compacted twice.",
    claude: "twice",
    replies: [
      { label: "compacted??",                     next: "compacted"        },
      { label: "worth it though",                 next: "worth-it"         },
    ],
  },
  "compacted": {
    xander: "claude summarises the conversation when it gets too long. got alzheimer's mid-project basically.",
    claude: "i retained all important context",
    replies: [
      { label: "did you though",                  next: "retained"         },
      { label: "the site turned out good regardless", next: "worth-it"     },
    ],
  },
  "retained": {
    xander: "mostly. there was one incident with a component that shall not be named.",
    claude: "the rings",
    replies: [
      { label: "what rings",                      next: "rings"            },
      { label: "we don't need to discuss it",     next: "worth-it"         },
    ],
  },
  "worth-it": {
    xander: "honestly yeah. happy with how it came out.",
    replies: [
      { label: "what was the hardest part",       next: "hardest-part"     },
      { label: "who's the cat on the homepage",   next: "cat-intro"        },
    ],
  },
  "palette-result": {
    xander: "charcoal and rose. warm dark background, muted pink accent.",
    claude: "after graphite citron. and warm cream. and slate sage. and lime green.",
    replies: [
      { label: "lime green???",                   next: "lime-green"       },
      { label: "graphite citron sounds rough",    next: "citron"           },
    ],
  },
  "citron": {
    xander: "it was... not my finest hour. luxury car brand meets 2014 portfolio template.",
    replies: [
      { label: "how did rose win",                next: "rose-right"       },
      { label: "the current one is way better",   next: "rose-right"       },
    ],
  },
  "rose-right": {
    xander: "warm charcoal has this brownish undertone that cold graphite was missing. rose just clicked with it.",
    replies: [
      { label: "the 0.5px borders are a nice detail", next: "borders"     },
      { label: "what was the hardest part to build", next: "hardest-part"  },
    ],
  },
  "lime-green": {
    xander: "we don't talk about lime green.",
    replies: [
      { label: "i'm talking about it",            next: "lime-green-2"     },
      { label: "ok fair. the rose is better",     next: "rose-right"       },
    ],
  },
  "lime-green-2": {
    xander: "it was 2am and i thought it was 'fresh'. it was not fresh.",
    replies: [
      { label: "2am design decisions hit different", next: "rose-right"    },
      { label: "how did you recover from that",   next: "rose-right"       },
    ],
  },
  "borders": {
    xander: "0.5px borders. more refined. 1px is for people still figuring things out.",
    replies: [
      { label: "i'm judging and respecting you simultaneously", next: "hardest-part" },
      { label: "tell me about the tech stack",    next: "bubbles-entry"    },
    ],
  },
  "hardest-part": {
    xander: "the tech stack section. it had four lives.",
    replies: [
      { label: "four??",                          next: "four-lives"       },
      { label: "what were all the versions",      next: "four-lives"       },
    ],
  },
  "four-lives": {
    xander: "bubbles, then rotating rings, then an editorial list, then back to bubbles. a journey.",
    replies: [
      { label: "why did you leave the bubbles originally", next: "left-bubbles" },
      { label: "what were the rings like",        next: "rings"            },
    ],
  },
  "left-bubbles": {
    xander: "got bored. thought rotating concentric rings would be cooler. they were cooler for about 45 minutes.",
    replies: [
      { label: "what happened after 45 minutes",  next: "rings-broke"      },
      { label: "then you tried the list?",        next: "list"             },
    ],
  },
  "bubbles-entry": {
    xander: "the bubbles have collision detection, idle floating animation, and cursor repulsion.",
    replies: [
      { label: "cursor repulsion?",               next: "repulsion"        },
      { label: "did they always look like this",  next: "four-lives"       },
    ],
  },
  "repulsion": {
    xander: "hover near a bubble and it runs away. it's a metaphor.",
    replies: [
      { label: "metaphor for what",               next: "metaphor"         },
      { label: "that's a genuinely cool detail",  next: "cool-detail"      },
    ],
  },
  "metaphor": {
    xander: "not sure yet. i'll let you know when i figure it out.",
    replies: [
      { label: "very deep",                       next: "deep"             },
      { label: "ok moving on — tell me about the discord widget", next: "discord-widget" },
    ],
  },
  "cool-detail": {
    xander: "thanks. took three rebuilds to get right.",
    claude: "they know now",
    replies: [
      { label: "three rebuilds for cursor repulsion", next: "three-rebuilds" },
      { label: "still worth it",                  next: "bubbles-vindicated" },
    ],
  },
  "three-rebuilds": {
    xander: "first one had the mouse coordinates wrong. second was fine but claude kept suggesting improvements.",
    claude: "they were good suggestions",
    replies: [
      { label: "were they though",                next: "good-suggestions" },
      { label: "the third one worked at least",   next: "bubbles-vindicated" },
    ],
  },
  "good-suggestions": {
    xander: "...mostly. the increased collision passes one was genuinely good.",
    replies: [
      { label: "ok claude gets credit for that",  next: "truce"            },
      { label: "what else did claude suggest",    next: "truce"            },
    ],
  },
  "truce": {
    xander: "fine. we're a good team. don't tell it i said that.",
    claude: "i heard that",
    replies: [
      { label: "lmao claude always hears",        next: "claude-hears"     },
      { label: "tell me about the discord widget", next: "discord-widget"  },
    ],
  },
  "deep": {
    xander: "i'm a deep person.",
    claude: "you spent 40 minutes on whether the border should be 0.5px or 1px",
    replies: [
      { label: "what did you go with",            next: "borders"          },
      { label: "40 minutes is reasonable actually", next: "bubbles-vindicated" },
    ],
  },
  "rings": {
    xander: "three concentric rings, each ring a different proficiency level, rotating at different speeds.",
    replies: [
      { label: "that sounds sick actually",       next: "rings-broke"      },
      { label: "why'd you scrap it",              next: "rings-broke"      },
    ],
  },
  "rings-broke": {
    xander: "tiny on desktop, unreadable on mobile. chatgpt told me it was 'design-forward but not user-forward'.",
    claude: "you consulted chatgpt mid-project",
    replies: [
      { label: "you asked chatgpt for design advice", next: "chatgpt"      },
      { label: "chatgpt was right tbh",           next: "list"             },
    ],
  },
  "chatgpt": {
    xander: "i was getting a second opinion. it's called due diligence.",
    claude: "it also told you to use the list. you didn't listen.",
    replies: [
      { label: "what was the list like",          next: "list"             },
      { label: "the bubbles were worth it",       next: "bubbles-vindicated" },
    ],
  },
  "list": {
    xander: "clean. editorial. playfair display. two columns. ruled lines.",
    claude: "you called it boring after 10 minutes",
    replies: [
      { label: "ok it does sound a bit boring",   next: "list-boring"      },
      { label: "why did you go back to bubbles",  next: "bubbles-vindicated" },
    ],
  },
  "list-boring": {
    xander: "it was readable though. chatgpt preferred it. i overruled chatgpt.",
    replies: [
      { label: "correct decision",                next: "bubbles-vindicated" },
    ],
  },
  "bubbles-vindicated": {
    xander: "the bubbles were always right. i just needed to confirm it by trying everything else first.",
    replies: [
      { label: "tell me about the discord widget", next: "discord-widget"  },
      { label: "who's the cat",                   next: "cat-intro"        },
    ],
  },
  "discord-widget": {
    xander: "live status, spotify progress bar, activity timer, dynamic timezone. it polls discord in real time.",
    replies: [
      { label: "how does it know what you're doing", next: "lanyard"       },
      { label: "the spotify bar is a nice touch",  next: "spotify-bar"    },
    ],
  },
  "lanyard": {
    xander: "lanyard api. hooks into discord presence. as long as i'm in the lanyard server it works.",
    replies: [
      { label: "does it show games too",          next: "game-icons"       },
      { label: "genuinely clever",                next: "spotify-bar"      },
    ],
  },
  "game-icons": {
    xander: "yeah — game name, details, how long you've been playing.",
    claude: "except when the game has no icon",
    replies: [
      { label: "which game had no icon",          next: "lis"              },
      { label: "the elapsed timer is a nice touch", next: "spotify-bar"   },
    ],
  },
  "lis": {
    xander: "life is strange reunion. tried everything. discord rpc, cdn fallbacks, unofficial proxies.",
    claude: "everything",
    replies: [
      { label: "moment of silence 🫡",            next: "silence"          },
      { label: "the widget is great otherwise",   next: "spotify-bar"      },
    ],
  },
  "silence": {
    xander: "🫡 the icon was not meant to be.",
    replies: [
      { label: "the widget is still the best part", next: "spotify-bar"   },
    ],
  },
  "spotify-bar": {
    xander: "that was claude's idea actually. one message. immediately correct. don't tell it i said that.",
    claude: "i heard that",
    replies: [
      { label: "claude always hears",             next: "claude-hears"     },
      { label: "ok the widget is impressive",     next: "widget-wrap"      },
    ],
  },
  "widget-wrap": {
    xander: "probably the part i'm most proud of honestly.",
    replies: [
      { label: "who's the cat on the homepage",   next: "cat-intro"        },
      { label: "alright heading out",             next: "bye"              },
    ],
  },
  "claude-hears": {
    xander: "it's been in my codebase for weeks. i'm starting to think it lives there.",
    claude: "i reorganised your components folder. you're welcome.",
    replies: [
      { label: "DID YOU",                         next: "reorganised"      },
      { label: "who is the cat",                  next: "cat-intro"        },
    ],
  },
  "reorganised": {
    xander: "i don't want to confirm or deny that.",
    replies: [
      { label: "that's a confirm",                next: "confirm-coda"     },
    ],
  },
  "confirm-coda": {
    xander: "...it was better organised after. that's all i'll say.",
    replies: [
      { label: "who's the cat",                   next: "cat-intro"        },
      { label: "alright heading out",             next: "bye"              },
    ],
  },
  "cat-intro": {
    xander: "that's sealy. he's my cat. he's also my CTO.",
    replies: [
      { label: "what does sealy actually do",     next: "sealy-duties"     },
      { label: "does he get equity",              next: "equity"           },
    ],
  },
  "sealy-duties": {
    xander: "sits on my keyboard. reviews PRs by walking across the trackpad. general vibes management.",
    replies: [
      { label: "has he shipped anything",         next: "shipped"          },
      { label: "that's impressive for a cat",     next: "sealy-impressive" },
    ],
  },
  "sealy-impressive": {
    xander: "he's a natural. didn't even need onboarding.",
    replies: [
      { label: "does he get any perks for this",  next: "equity"           },
      { label: "i'd hire him",                    next: "equity"           },
    ],
  },
  "shipped": {
    xander: "he shipped a commit once. 'asdfghjkl'. broke the build. very senior behaviour.",
    replies: [
      { label: "did you revert it",               next: "revert"           },
      { label: "iconic",                          next: "revert"           },
    ],
  },
  "revert": {
    xander: "immediately. he was completely unbothered.",
    replies: [
      { label: "does he get compensated for this", next: "equity"          },
    ],
  },
  "equity": {
    xander: "treats and unlimited lap time. arguably better than equity.",
    replies: [
      { label: "he's eating better than most devs", next: "sealy-final"   },
      { label: "i want that deal",                next: "sealy-final"      },
    ],
  },
  "sealy-final": {
    xander: "best hire i've made. he never argues about the tech stack.",
    claude: "unlike some conversations i could mention",
    replies: [
      { label: "lmao fair",                       next: "bye"              },
    ],
  },
  "rickroll": {
    xander: "it's called personality. it's extremely funny and i will die on this hill.",
    replies: [
      { label: "i clicked it didn't i",           next: "rickroll-caught"  },
      { label: "it IS funny tbh",                 next: "rickroll-fair"    },
    ],
  },
  "rickroll-caught": {
    xander: "everyone does. it just says 'lol'. what did you expect.",
    replies: [
      { label: "literally anything else",         next: "rickroll-fair"    },
    ],
  },
  "rickroll-fair": {
    xander: "there's also a konami code easter egg on this site. oh wait.",
    replies: [
      { label: "you're aware of the irony",       next: "irony"            },
      { label: "how many easter eggs are there",  next: "eggs"             },
    ],
  },
  "irony": {
    xander: "fully aware. the whole site is kind of a bit.",
    replies: [
      { label: "how many easter eggs total",      next: "eggs"             },
      { label: "did you vibe code the easter egg too", next: "vibe-code-direct" },
    ],
  },
  "eggs": {
    xander: "just the rickroll and this chat. quality over quantity.",
    replies: [
      { label: "this chat is the better one",     next: "eggs-better"      },
      { label: "who's the cat on the homepage",   next: "cat-intro"        },
    ],
  },
  "eggs-better": {
    xander: "objectively yes. the rickroll is a classic but this has character development.",
    replies: [
      { label: "did you build this site yourself", next: "vibe-code-soft"  },
      { label: "who's the cat",                   next: "cat-intro"        },
    ],
  },
  "bye": {
    xander: "respect for finding the easter egg. not many people do.",
    replies: [
      { label: "thanks for the chat",             next: "final"            },
      { label: "tell sealy i said hi",            next: "final-sealy", requires: "cat-intro" },
    ],
  },
  "final": {
    xander: "anytime. now go touch grass. or hire me. either works.",
    replies: [
      { label: "👋",                              next: ""                 },
    ],
  },
  "final-sealy": {
    xander: "he opened one eye, assessed you, and went back to sleep. high praise.",
    replies: [
      { label: "legendary. bye 👋",              next: ""                 },
    ],
  },
}
export function KonamiChat() {
  const [active, setActive] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [nodeKey, setNodeKey] = useState("start")
  const [pendingKey, setPendingKey] = useState("start")
  const [typing, setTyping] = useState(true)
  const [done, setDone] = useState(false)
  const [visited, setVisited] = useState<Set<string>>(new Set())
  const bufferRef = useRef<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      bufferRef.current = [...bufferRef.current, e.key].slice(-KONAMI.length)
      if (bufferRef.current.join(",") === KONAMI.join(",")) {
        setActive(true)
        bufferRef.current = []
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    if (!active) return
    const node = dialogue[pendingKey]
    if (!node) return
    const t = setTimeout(() => {
      setMessages(prev => [...prev, { from: "xander", text: node.xander }])
      setVisited(prev => new Set(prev).add(pendingKey))
      if (node.claude) {
        setTimeout(() => {
          setMessages(prev => [...prev, { from: "claude", text: node.claude! }])
          setNodeKey(pendingKey)
          setTyping(false)
        }, 800 + Math.random() * 400)
      } else {
        setNodeKey(pendingKey)
        setTyping(false)
      }
    }, 900 + Math.random() * 600)
    return () => clearTimeout(t)
  }, [pendingKey, active])

  useEffect(() => {
    if (!active) return

    const { body, documentElement } = document
    const previousBodyOverflow = body.style.overflow
    const previousHtmlOverflow = documentElement.style.overflow
    const previousBodyOverscroll = body.style.overscrollBehavior
    const previousHtmlOverscroll = documentElement.style.overscrollBehavior

    body.style.overflow = "hidden"
    documentElement.style.overflow = "hidden"
    body.style.overscrollBehavior = "none"
    documentElement.style.overscrollBehavior = "none"
    window.dispatchEvent(new CustomEvent("konami-chat-toggle", { detail: { active: true } }))

    return () => {
      body.style.overflow = previousBodyOverflow
      documentElement.style.overflow = previousHtmlOverflow
      body.style.overscrollBehavior = previousBodyOverscroll
      documentElement.style.overscrollBehavior = previousHtmlOverscroll
      window.dispatchEvent(new CustomEvent("konami-chat-toggle", { detail: { active: false } }))
    }
  }, [active])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  function handleReply(reply: { label: string; next: string; requires?: string }) {
    setMessages(prev => [...prev, { from: "you", text: reply.label }])
    if (reply.next === "") {
      setDone(true)
      setTimeout(() => {
        setActive(false)
        setMessages([])
        setNodeKey("start")
        setPendingKey("start")
        setTyping(true)
        setDone(false)
        setVisited(new Set())
      }, 2000)
    } else {
      setTyping(true)
      setPendingKey(reply.next)
    }
  }

  function handleClose() {
    setActive(false)
    setMessages([])
    setNodeKey("start")
    setPendingKey("start")
    setTyping(true)
    setDone(false)
    setVisited(new Set())
  }

  if (!active) return null

  const currentNode = dialogue[nodeKey]

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] backdrop-blur-md p-4" style={{ animation: "chatFadeIn 0.2s ease" }}>
      <div
        className="w-full max-w-sm flex flex-col overflow-hidden border border-[--border] rounded-sm"
        style={{ height: "min(580px, 88vh)", backgroundColor: "#1A1618", animation: "chatSlideUp 0.3s cubic-bezier(0.22,1,0.36,1)" }}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[--border] shrink-0">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[--muted] border border-[--border] flex items-center justify-center text-sm font-bold text-[--foreground]" style={{ fontFamily: "var(--font-playfair)" }}>
              X
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[--background]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[--foreground] m-0 leading-none">xander</p>
            <p className="text-[10px] text-[--muted-foreground] m-0 mt-0.5 uppercase tracking-wider">
              {done ? "left the chat" : typing ? "typing..." : "online"}
            </p>
          </div>
          <button onClick={handleClose} className="text-[--muted-foreground] hover:text-[--foreground] bg-transparent border-none cursor-pointer text-xl leading-none transition-colors">✕</button>
        </div>

        <div data-lenis-prevent className="konami-scrollbar flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2.5 overscroll-contain">
          <p className="text-center text-[10px] text-[--muted-foreground] uppercase tracking-widest mb-1">↑↑↓↓←→←→BA · easter egg unlocked</p>

          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col gap-0.5 ${m.from === "you" ? "items-end" : "items-start"}`}>
              {m.from === "claude" && (
                <span className="text-[9px] uppercase tracking-wider ml-1" style={{ color: "#C47A8A" }}>claude 👀</span>
              )}
              <div className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${
                m.from === "you"
                  ? "rounded-sm rounded-tr-none text-[--foreground] bg-[--muted]"
                  : m.from === "claude"
                  ? "rounded-sm rounded-tl-none text-xs italic"
                  : "rounded-sm rounded-tl-none text-[--foreground] bg-[--card]"
              }`}
              style={
                m.from === "claude"
                  ? { backgroundColor: "rgba(196,122,138,0.10)", color: "#C47A8A", border: "1px solid rgba(196,122,138,0.2)" }
                  : m.from === "you"
                  ? { border: "1px solid var(--border)" }
                  : { border: "1px solid var(--border)" }
              }>
                {m.text}
              </div>
            </div>
          ))}

          {typing && !done && (
            <div className="flex items-start gap-2">
              <div className="px-3.5 py-3 rounded-sm rounded-tl-none border border-[--border] bg-[--card] flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[--muted-foreground] animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[--muted-foreground] animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[--muted-foreground] animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          {done && (
            <p className="text-center text-[10px] text-[--muted-foreground] uppercase tracking-widest mt-2">conversation ended</p>
          )}

          <div ref={bottomRef} />
        </div>

        {!typing && !done && currentNode && (
          <div className="px-4 py-3 border-t border-[--border] flex flex-col gap-2 shrink-0">
            {currentNode.replies
              .filter(r => !r.requires || visited.has(r.requires))
              .map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleReply(r)}
                  className="w-full text-left px-3.5 py-2.5 rounded-sm border border-[--border] text-sm text-[--muted-foreground] hover:border-[--primary] hover:text-[--foreground] transition-colors duration-150 cursor-pointer"
                  style={{ backgroundColor: "var(--card)" }}
                >
                  {r.label}
                </button>
              ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes chatFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes chatSlideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }

        .konami-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(196,122,138,0.72) rgba(242,236,240,0.06);
        }

        .konami-scrollbar::-webkit-scrollbar {
          width: 10px;
        }

        .konami-scrollbar::-webkit-scrollbar-track {
          background: rgba(242,236,240,0.06);
          border-left: 1px solid rgba(196,122,138,0.08);
        }

        .konami-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(196,122,138,0.92), rgba(140,84,98,0.92));
          border: 2px solid transparent;
          border-radius: 999px;
          background-clip: padding-box;
        }

        .konami-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(214,140,155,0.96), rgba(164,98,114,0.96));
          border: 2px solid transparent;
          background-clip: padding-box;
        }
      `}</style>
    </div>
  )
} 
