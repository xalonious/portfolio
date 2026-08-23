import {
  assertDialogueGraph,
  defineDialogue,
} from "./dialogue-types"

export const dialogue = defineDialogue({
  // Discovery and build-story entry points
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
      { label: "what was the hardest part to build", next: "cms.intro"     },
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
      { label: "four lives for the tech stack??", next: "design.tech-stack-history" },
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
      { label: "what was the hardest part",       next: "cms.intro"        },
      { label: "who's the cat on the homepage",   next: "cat-intro"        },
    ],
  },
  // Visual design
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
      { label: "what was the hardest part to build", next: "cms.intro"     },
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
      { label: "what else did you overengineer",  next: "cms.intro"        },
      { label: "tell me about the tech stack",    next: "borders-to-stack"  },
    ],
  },
  "borders-to-stack": {
    xander: "the tech stack section is probably the most iterated part of the whole site.",
    replies: [
      { label: "how so",                          next: "design.tech-stack-history" },
      { label: "what does it look like now",      next: "bubbles-entry"    },
    ],
  },
  // Portfolio CMS
  "cms.intro": {
    xander: "it used to be the tech stack section. then i built an entire CMS because editing one TypeScript file was apparently too much work.",
    claude: "he wrote thousands of lines to avoid editing one file",
    replies: [
      { label: "you built a CMS for a portfolio?", next: "cms.for-portfolio" },
      { label: "ok but what does it actually do", next: "cms.features"     },
    ],
  },
  "cms.for-portfolio": {
    xander: "yes. it saves me roughly five minutes every few weeks. the return on investment is projected for 2047.",
    claude: "optimistic",
    replies: [
      { label: "surely this was overkill",        next: "cms.overkill"     },
      { label: "what did you actually build",     next: "cms.features"     },
    ],
  },
  "cms.overkill": {
    xander: "absolutely. then it became its own case study, which technically makes it content-generating infrastructure.",
    claude: "he built the project so he could add the project to the project",
    replies: [
      { label: "that's painfully software engineer", next: "cms.features" },
      { label: "does the ssh portfolio use it too", next: "cms.shared"     },
    ],
  },
  "cms.features": {
    xander: "drafts, publishing, revisions, structured case studies, validation, persistent media, and drag-and-drop project ordering. normal portfolio stuff.",
    claude: "none of that is normal portfolio stuff",
    replies: [
      { label: "how does publishing work",        next: "cms.publishing"   },
      { label: "what do you mean persistent media", next: "cms.media"      },
      { label: "why does it have revisions",      next: "cms.revisions"    },
    ],
  },
  "cms.publishing": {
    xander: "editing stays private. publishing validates the whole document, updates the public record, and saves the previous version as a revision.",
    claude: "he built a content pipeline",
    replies: [
      { label: "and both portfolios read that?",  next: "cms.shared"       },
      { label: "how is the admin page protected", next: "cms.security"     },
    ],
  },
  "cms.media": {
    xander: "uploads live outside the deployment directory, so a git pull can't delete them. the database and media sit together under appdata on my pi.",
    claude: "surprisingly sensible",
    replies: [
      { label: "how is the admin page protected", next: "cms.security"     },
      { label: "what about the ssh portfolio",    next: "cms.shared"       },
    ],
  },
  "cms.revisions": {
    xander: "i nearly removed revisions for being overkill, which is how you know the rest of the CMS was perfectly reasonable.",
    claude: "he kept them",
    replies: [
      { label: "of course you did",               next: "cms.revisions-wrap" },
      { label: "how does publishing work",        next: "cms.publishing"   },
    ],
  },
  "cms.revisions-wrap": {
    xander: "future me will appreciate the rollback the first time i break something. until then, yes, it's mostly evidence.",
    replies: [
      { label: "what else did you overengineer",  next: "borders-to-stack" },
      { label: "who's the cat",                   next: "cat-intro"        },
      { label: "alright heading out",             next: "bye"              },
    ],
  },
  "cms.security": {
    xander: "nginx only exposes the admin routes to my IP, the app port is firewalled, and the app only trusts the access header from the proxy.",
    claude: "he did actually think about it",
    replies: [
      { label: "okay that's respectable",         next: "cms.wrap"         },
      { label: "and the ssh portfolio shares it?", next: "cms.shared"      },
    ],
  },
  "cms.shared": {
    xander: "the Next.js site and the Go SSH portfolio read the same published SQLite view. i publish once and both update.",
    claude: "this part is actually good",
    replies: [
      { label: "don't sound so surprised",        next: "cms.wrap"         },
      { label: "okay that's genuinely clever",    next: "cms.wrap"         },
    ],
  },
  "cms.wrap": {
    xander: "thank you. please ignore how much code was required to stop editing a single file.",
    replies: [
      { label: "what else did you overengineer",  next: "borders-to-stack" },
      { label: "who's the cat",                   next: "cat-intro"        },
      { label: "alright heading out",             next: "bye"              },
    ],
  },
  // Tech-stack visualization
  "design.tech-stack-history": {
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
      { label: "did they always look like this",  next: "design.tech-stack-history" },
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
  // Discord presence
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
  // Sealy
  "cat-intro": {
    xander: "that's sealy. he's my cat. he's also my CTO.",
    replies: [
      { label: "what does sealy actually do",     next: "sealy-duties"     },
      { label: "does he get equity",              next: "equity"           },
      { label: "what's his origin story",         next: "sealy-origin"     },
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
      { label: "iconic",                          next: "iconic"           },
    ],
  },
  "iconic": {
    xander: "exactly. finally, someone appreciates his creative process.",
    replies: [
      { label: "does he get compensated for this", next: "equity"          },
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
      { label: "does he have framework opinions",  next: "sealy-frameworks" },
      { label: "what's his origin story",         next: "sealy-origin"     },
      { label: "lmao fair",                       next: "bye"              },
    ],
  },
  "sealy-frameworks": {
    xander: "he walked across the keyboard once and typed 'vue'. i chose to ignore it.",
    replies: [
      { label: "maybe he's onto something",       next: "sealy-vue"        },
      { label: "correct decision",                next: "sealy-origin"     },
    ],
  },
  "sealy-vue": {
    xander: "he also typed 'aaaaaaaa' right after. i think it was a cry for help not a framework recommendation.",
    replies: [
      { label: "what's his origin story",         next: "sealy-origin"     },
      { label: "what about the 404 page",         next: "fourohfour"       },
    ],
  },
  "sealy-origin": {
    xander: "found him at 8 weeks old. tiny. loud. immediately started sitting on my laptop.",
    replies: [
      { label: "natural born engineer",           next: "sealy-born"       },
      { label: "did he have a portfolio",         next: "sealy-portfolio"  },
    ],
  },
  "sealy-born": {
    xander: "his first week he deleted a local branch. still not sure how. i promoted him immediately.",
    replies: [
      { label: "what about the 404 page",         next: "fourohfour"       },
      { label: "alright heading out",             next: "bye"              },
    ],
  },
  "sealy-portfolio": {
    xander: "just a box he sat in and stared at me from. strong vibe. no projects. hired on the spot.",
    replies: [
      { label: "honestly valid hiring criteria",  next: "sealy-born"       },
    ],
  },
  // 404 page
  "fourohfour": {
    xander: "you found the 404 page?",
    replies: [
      { label: "yeah sealy's on it",              next: "fourohfour-yes"   },
      { label: "not yet but i heard about it",    next: "fourohfour-heard" },
    ],
  },
  "fourohfour-yes": {
    xander: "he's been placed on a performance improvement plan. treats suspended pending investigation.",
    claude: "he looked extremely unbothered in that photo",
    replies: [
      { label: "he really did",                   next: "fourohfour-unbothered" },
      { label: "is he actually in trouble",       next: "fourohfour-trouble"    },
    ],
  },
  "fourohfour-heard": {
    xander: "go to a page that doesn't exist. you'll find him.",
    replies: [
      { label: "on it",                           next: "bye"              },
    ],
  },
  "fourohfour-unbothered": {
    xander: "the box does that to him. gives him this unshakeable confidence. i respect it.",
    replies: [
      { label: "box mentality",                   next: "fourohfour-box"   },
      { label: "alright heading out",             next: "bye"              },
    ],
  },
  "fourohfour-trouble": {
    xander: "no. he got extra treats for the exposure. terrible precedent i've set.",
    claude: "you literally cropped the photo to make him look cute",
    replies: [
      { label: "wait you curated it",             next: "fourohfour-curated" },
      { label: "classic management",              next: "bye"              },
    ],
  },
  "fourohfour-curated": {
    xander: "it's called brand consistency. he IS the 404 page. he earned it.",
    replies: [
      { label: "he's more than a CTO. he's a brand.", next: "sealy-brand" },
      { label: "legendary. alright i'm out",      next: "bye"             },
    ],
  },
  "fourohfour-box": {
    xander: "he sees the box as his domain. everything inside it is his. that includes my codebase apparently.",
    replies: [
      { label: "did he delete the 404 page on purpose", next: "fourohfour-purpose" },
    ],
  },
  "fourohfour-purpose": {
    xander: "i genuinely can't rule it out.",
    claude: "the commit timestamp was 3am. he was on the keyboard.",
    replies: [
      { label: "CLAUDE",                          next: "fourohfour-claude" },
      { label: "3am keyboard activity is very senior", next: "bye"        },
    ],
  },
  "fourohfour-claude": {
    xander: "i told you. zero loyalty.",
    claude: "i'm just here to document the facts.",
    replies: [
      { label: "this is the best 404 lore i've ever heard", next: "bye"  },
    ],
  },
  "sealy-brand": {
    xander: "he has more character than most developer portfolios i've seen. honestly.",
    claude: "including some i've built",
    replies: [
      { label: "claude included himself in that", next: "claude-self-aware" },
      { label: "legendary. bye 👋",              next: ""                 },
    ],
  },
  "claude-self-aware": {
    xander: "yeah i don't know what to do with that.",
    claude: "growth.",
    replies: [
      { label: "👋",                              next: ""                 },
    ],
  },
  // Other easter eggs
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
    xander: "the rickroll, this chat, a curl easter egg, and a full terminal portfolio over ssh. quality over quantity.",
    replies: [
      { label: "wait a curl easter egg??",        next: "curl-egg"         },
      { label: "a terminal portfolio??",          next: "ssh-egg"          },
      { label: "this chat is the better one",     next: "eggs-better"      },
      { label: "what about the 404 page",         next: "fourohfour"       },
      { label: "who's the cat on the homepage",   next: "cat-intro"        },
    ],
  },
  "curl-egg": {
    xander: "curl https://whoisxander.dev in a terminal. you'll see.",
    claude: "sealy makes an appearance",
    replies: [
      { label: "of course he does",               next: "curl-sealy"       },
      { label: "what about the ssh thing",        next: "ssh-egg"          },
      { label: "this chat is still the best one", next: "curl-best"        },
    ],
  },
  "curl-sealy": {
    xander: "he insisted. i didn't even ask.",
    replies: [
      { label: "what about the ssh portfolio",    next: "ssh-egg"          },
      { label: "this chat is still better",       next: "eggs-better"      },
    ],
  },
  "curl-best": {
    xander: "objectively yes. the curl one has sealy. this one has character development.",
    replies: [
      { label: "what about the ssh portfolio",    next: "ssh-egg"          },
      { label: "fair",                            next: "eggs-better"      },
    ],
  },
  "ssh-egg": {
    xander: "ssh term.whoisxander.dev -p 2323. full terminal version of the portfolio.",
    replies: [
      { label: "you made a terminal portfolio??", next: "ssh-why"          },
      { label: "that's genuinely insane",         next: "ssh-why"          },
      { label: "does it share the same projects", next: "cms.shared"       },
    ],
  },
  "ssh-why": {
    xander: "because i could. and because people who find it via ssh are exactly the kind of people i want to work with.",
    claude: "he spent longer on the terminal version than the scroll progress bar",
    replies: [
      { label: "that tracks",                     next: "ssh-tracks"       },
      { label: "this chat is still better though", next: "eggs-better"     },
    ],
  },
  "ssh-tracks": {
    xander: "deeply. the scroll bar was polish. the ssh version was a whole second portfolio wearing a trench coat.",
    replies: [
      { label: "did you build this site yourself", next: "vibe-code-soft"  },
      { label: "who's the cat",                   next: "cat-intro"        },
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
})

export type DialogueNodeId = keyof typeof dialogue

assertDialogueGraph(dialogue, "start")
