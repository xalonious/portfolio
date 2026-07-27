"use client"

import { useEffect, useRef, useState } from "react"
import {
  dialogue,
  type DialogueNodeId,
} from "./konami-chat/dialogue"
import type {
  ChatMessage,
  DialogueReply,
} from "./konami-chat/dialogue-types"

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
]

export function KonamiChat() {
  const [active, setActive] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [nodeKey, setNodeKey] = useState<DialogueNodeId>("start")
  const [pendingKey, setPendingKey] = useState<DialogueNodeId>("start")
  const [typing, setTyping] = useState(true)
  const [done, setDone] = useState(false)
  const [visited, setVisited] = useState<Set<DialogueNodeId>>(new Set())
  const bufferRef = useRef<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      bufferRef.current = [...bufferRef.current, event.key].slice(-KONAMI.length)
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
    let claudeTimer: ReturnType<typeof setTimeout> | undefined
    const xanderTimer = setTimeout(() => {
      setMessages(previous => [
        ...previous,
        { from: "xander", text: node.xander },
      ])
      setVisited(previous => new Set(previous).add(pendingKey))

      if (node.claude) {
        claudeTimer = setTimeout(() => {
          setMessages(previous => [
            ...previous,
            { from: "claude", text: node.claude! },
          ])
          setNodeKey(pendingKey)
          setTyping(false)
        }, 800 + Math.random() * 400)
      } else {
        setNodeKey(pendingKey)
        setTyping(false)
      }
    }, 900 + Math.random() * 600)

    return () => {
      clearTimeout(xanderTimer)
      if (claudeTimer) clearTimeout(claudeTimer)
    }
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
    window.dispatchEvent(
      new CustomEvent("konami-chat-toggle", { detail: { active: true } }),
    )

    return () => {
      body.style.overflow = previousBodyOverflow
      documentElement.style.overflow = previousHtmlOverflow
      body.style.overscrollBehavior = previousBodyOverscroll
      documentElement.style.overscrollBehavior = previousHtmlOverscroll
      window.dispatchEvent(
        new CustomEvent("konami-chat-toggle", { detail: { active: false } }),
      )
    }
  }, [active])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  function resetConversation() {
    setMessages([])
    setNodeKey("start")
    setPendingKey("start")
    setTyping(true)
    setDone(false)
    setVisited(new Set())
  }

  function handleReply(reply: DialogueReply<DialogueNodeId>) {
    setMessages(previous => [
      ...previous,
      { from: "you", text: reply.label },
    ])

    if (reply.next === "") {
      setDone(true)
      setTimeout(() => {
        setActive(false)
        resetConversation()
      }, 2000)
      return
    }

    setTyping(true)
    setPendingKey(reply.next)
  }

  function handleClose() {
    setActive(false)
    resetConversation()
  }

  if (!active) return null

  const currentNode = dialogue[nodeKey]

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
      style={{ animation: "chatFadeIn 0.2s ease" }}
    >
      <div
        className="flex w-full max-w-sm flex-col overflow-hidden rounded-sm border border-[--border]"
        style={{
          height: "min(580px, 88vh)",
          backgroundColor: "#1A1618",
          animation: "chatSlideUp 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-[--border] px-4 py-3">
          <div className="relative">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[--border] bg-[--muted] text-sm font-bold text-[--foreground]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              X
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[--background] bg-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="m-0 text-sm font-semibold leading-none text-[--foreground]">
              xander
            </p>
            <p className="m-0 mt-0.5 text-[10px] uppercase tracking-wider text-[--muted-foreground]">
              {done ? "left the chat" : typing ? "typing..." : "online"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="border-none bg-transparent text-xl leading-none text-[--muted-foreground] transition-colors hover:text-[--foreground]"
            aria-label="Close chat"
          >
            ×
          </button>
        </div>

        <div
          data-lenis-prevent
          className="konami-scrollbar flex flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain px-4 py-4"
        >
          <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-[--muted-foreground]">
            ↑↑↓↓←→←→BA · easter egg unlocked
          </p>

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex flex-col gap-0.5 ${
                message.from === "you" ? "items-end" : "items-start"
              }`}
              style={{
                animation:
                  "msgSlideIn 0.25s cubic-bezier(0.22,1,0.36,1) both",
              }}
            >
              {message.from === "claude" && (
                <span
                  className="ml-1 text-[9px] uppercase tracking-wider"
                  style={{ color: "#C47A8A" }}
                >
                  claude 👀
                </span>
              )}
              <div
                className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${
                  message.from === "you"
                    ? "rounded-sm rounded-tr-none bg-[--muted] text-[--foreground]"
                    : message.from === "claude"
                      ? "rounded-sm rounded-tl-none text-xs italic"
                      : "rounded-sm rounded-tl-none bg-[--card] text-[--foreground]"
                }`}
                style={
                  message.from === "claude"
                    ? {
                        backgroundColor: "rgba(196,122,138,0.10)",
                        color: "#C47A8A",
                        border: "1px solid rgba(196,122,138,0.2)",
                      }
                    : { border: "1px solid var(--border)" }
                }
              >
                {message.text}
              </div>
            </div>
          ))}

          {typing && !done && (
            <div
              className="flex items-start gap-2"
              style={{
                animation:
                  "msgSlideIn 0.25s cubic-bezier(0.22,1,0.36,1) both",
              }}
            >
              <div className="flex items-center gap-1 rounded-sm rounded-tl-none border border-[--border] bg-[--card] px-3.5 py-3">
                <span
                  className="typing-dot"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="typing-dot"
                  style={{ animationDelay: "180ms" }}
                />
                <span
                  className="typing-dot"
                  style={{ animationDelay: "360ms" }}
                />
              </div>
            </div>
          )}

          {done && (
            <p className="mt-2 text-center text-[10px] uppercase tracking-widest text-[--muted-foreground]">
              conversation ended
            </p>
          )}

          <div ref={bottomRef} />
        </div>

        {!typing && !done && (
          <div className="flex shrink-0 flex-col gap-2 border-t border-[--border] px-4 py-3">
            {currentNode.replies
              .filter(reply => !reply.requires || visited.has(reply.requires))
              .map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleReply(reply)}
                  className="w-full rounded-sm border border-[--border] px-3.5 py-2.5 text-left text-sm text-[--muted-foreground] transition-colors duration-150 hover:border-[--primary] hover:text-[--foreground]"
                  style={{ backgroundColor: "var(--card)" }}
                >
                  {reply.label}
                </button>
              ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes chatFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes chatSlideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes msgSlideIn  { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-4px); opacity: 1; }
        }
        .typing-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--muted-foreground, #7A6B72);
          animation: typingBounce 1.2s ease-in-out infinite;
        }

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
