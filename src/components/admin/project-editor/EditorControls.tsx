"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  inputStyles,
  labelStyles,
} from "@/components/admin/project-editor/styles"

export function EditorPanel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-sm border border-[--border] bg-[--card] p-5 sm:p-6">
      <p className={labelStyles}>{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl font-bold text-[--foreground]">
        {title}
      </h2>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  )
}

export function TextField({
  label,
  value,
  error,
  onChange,
}: {
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className={labelStyles}>{label}</span>
      <input
        value={value}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputStyles} ${
          error ? "border-red-700/80 focus:border-red-500" : ""
        }`}
      />
      {error && <span className="mt-2 block text-xs text-red-300">{error}</span>}
    </label>
  )
}

export function NumberField({
  label,
  value,
  error,
  onChange,
}: {
  label: string
  value: number
  error?: string
  onChange: (value: number) => void
}) {
  return (
    <label className="block">
      <span className={labelStyles}>{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
        className={`${inputStyles} ${
          error ? "border-red-700/80 focus:border-red-500" : ""
        }`}
      />
      {error && <span className="mt-2 block text-xs text-red-300">{error}</span>}
    </label>
  )
}

export function TextAreaField({
  label,
  value,
  rows,
  error,
  onChange,
}: {
  label: string
  value: string
  rows: number
  error?: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className={labelStyles}>{label}</span>
      <textarea
        value={value}
        rows={rows}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputStyles} resize-y leading-6 ${
          error ? "border-red-700/80 focus:border-red-500" : ""
        }`}
      />
      {error && <span className="mt-2 block text-xs text-red-300">{error}</span>}
    </label>
  )
}

export function SelectField({
  label,
  value,
  options,
  error,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  error?: string
  onChange: (value: string) => void
}) {
  return (
    <div className="block">
      <span className={labelStyles}>{label}</span>
      <Dropdown
        value={value}
        options={options.map((option) => ({
          value: option,
          label: option,
        }))}
        onChange={onChange}
        className="mt-2"
        invalid={Boolean(error)}
      />
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  )
}

export function Dropdown({
  value,
  options,
  onChange,
  placeholder = "Choose an option…",
  className = "",
  invalid = false,
}: {
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  invalid?: boolean
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    if (!open) return

    function closeOnOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [open])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-between gap-3 rounded-sm border bg-[--background] px-3 py-2.5 text-left text-sm text-[--foreground] outline-none transition ${
          invalid
            ? "border-red-700/80 hover:border-red-600 focus:border-red-500"
            : "border-[--border] hover:border-[--muted-foreground] focus:border-[--primary]"
        }`}
      >
        <span className={selected ? "" : "text-[--muted-foreground]"}>
          {selected?.label ?? placeholder}
        </span>
        <span
          aria-hidden="true"
          className={`text-[10px] text-[--muted-foreground] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-[80] mt-1 max-h-64 w-full overflow-y-auto rounded-sm border border-[--border] bg-[#231E21] p-1 shadow-2xl shadow-black/50"
        >
          {options.length ? (
            options.map((option) => {
              const active = option.value === value

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition ${
                    active
                      ? "bg-[--primary]/15 text-[--primary]"
                      : "text-[--foreground] hover:bg-[--muted]"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {active && (
                    <span aria-hidden="true" className="text-xs">
                      ✓
                    </span>
                  )}
                </button>
              )
            })
          ) : (
            <p className="px-3 py-2 text-sm text-[--muted-foreground]">
              No options available.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
