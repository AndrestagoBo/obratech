"use client";

import { useEffect, useRef, useState } from "react";
import { whatsappUrl } from "@/lib/content";
import { OPEN_ASSISTANT_EVENT } from "@/components/open-assistant-button";
import {
  START_CHIPS,
  WELCOME,
  assistantCanGoBack,
  assistantInputHint,
  type AssistantChip,
  type AssistantCta,
  type AssistantState,
} from "@/lib/assistant-local";

type ChatItem = {
  role: "user" | "assistant";
  text: string;
  ctas?: AssistantCta[];
  chips?: AssistantChip[];
};

const STORAGE_KEY = "obratech-assistant-v17";
const CHAT_REVISION = 17;
const OLD_KEYS = [
  "obratech-assistant-v1",
  "obratech-assistant-v2",
  "obratech-assistant-v3",
  "obratech-assistant-v4",
  "obratech-assistant-v5",
  "obratech-assistant-v6",
  "obratech-assistant-v7",
  "obratech-assistant-v8",
  "obratech-assistant-v9",
  "obratech-assistant-v10",
  "obratech-assistant-v11",
  "obratech-assistant-v12",
  "obratech-assistant-v13",
  "obratech-assistant-v14",
  "obratech-assistant-v15",
  "obratech-assistant-v16",
];

function welcome(whatsappNumber: string): ChatItem {
  return {
    role: "assistant",
    text: WELCOME,
    chips: START_CHIPS,
    ctas: [{ label: "WhatsApp", href: whatsappUrl(whatsappNumber) }],
  };
}

export function SiteAssistant({ whatsappNumber }: { whatsappNumber: string }) {
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<AssistantState>({ jobs: [], current: 0 });
  // Firma que emite el servidor para el estado. Se devuelve tal cual en el
  // siguiente turno; sin ella el servidor reinicia la conversación.
  const [sig, setSig] = useState("");
  const [items, setItems] = useState<ChatItem[]>([welcome(whatsappNumber)]);

  const setOpenSafe = (value: boolean | ((prev: boolean) => boolean)) => {
    setOpen((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      if (prev && !next) {
        window.setTimeout(() => launcherRef.current?.focus(), 0);
      }
      return next;
    });
  };

  useEffect(() => {
    for (const key of OLD_KEYS) sessionStorage.removeItem(key);
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          revision?: number;
          items?: ChatItem[];
          state?: AssistantState;
          sig?: string;
        };
        const fresh =
          parsed.revision === CHAT_REVISION &&
          parsed.items?.[0]?.text?.includes("Qué necesita tu hogar");
        if (fresh && parsed.items?.length) {
          setItems(parsed.items);
          setState(parsed.state ?? { jobs: [], current: 0 });
          setSig(parsed.sig ?? "");
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
          setItems([welcome(whatsappNumber)]);
          setState({ jobs: [], current: 0 });
          setSig("");
        }
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, [whatsappNumber]);

  useEffect(() => {
    if (!ready) return;
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ revision: CHAT_REVISION, items, state, sig }),
    );
  }, [ready, items, state, sig]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [items, pending, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = dialogRef.current;
    if (!root) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenSafe(false);
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = [
        ...root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((el) => !el.hasAttribute("disabled"));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onOpen = () => setOpenSafe(true);
    window.addEventListener(OPEN_ASSISTANT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, onOpen);
  }, []);

  const clearChat = () => {
    setInput("");
    setPending(false);
    setState({ jobs: [], current: 0 });
    setSig("");
    setItems([welcome(whatsappNumber)]);
    sessionStorage.removeItem(STORAGE_KEY);
    inputRef.current?.focus();
  };

  const send = async (text: string, silent = false) => {
    const message = text.trim();
    if (!message || pending) return;
    setInput("");
    if (!silent) setItems((prev) => [...prev, { role: "user", text: message }]);
    setPending(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, state, sig }),
      });
      const data = (await res.json()) as {
        text?: string;
        ctas?: AssistantCta[];
        chips?: AssistantChip[];
        state?: AssistantState;
        sig?: string;
        error?: string;
      };
      if (!res.ok) {
        setItems((prev) => [
          ...prev,
          { role: "assistant", text: data.error || "No pude responder ahora." },
        ]);
        return;
      }
      if (data.state) setState(data.state);
      setSig(data.sig ?? "");
      setItems((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.text || "",
          ctas: data.ctas,
          chips: data.chips,
        },
      ]);
    } catch {
      setItems((prev) => [
        ...prev,
        { role: "assistant", text: "Sin conexión. Usa el formulario o WhatsApp." },
      ]);
    } finally {
      setPending(false);
    }
  };

  const lastAssistant = [...items].reverse().find((item) => item.role === "assistant");
  const chips = pending ? [] : lastAssistant?.chips?.length ? lastAssistant.chips : START_CHIPS;
  const placeholder = pending ? "Espera un momento..." : assistantInputHint(state);

  return (
    <div
      className={`fixed z-50 pointer-events-none left-4 right-4 md:left-8 md:right-auto ${
        open
          ? "bottom-[max(5rem,calc(5rem+env(safe-area-inset-bottom)))] md:bottom-[max(2rem,calc(2rem+env(safe-area-inset-bottom)))]"
          : "bottom-[max(2rem,calc(2rem+env(safe-area-inset-bottom)))]"
      }`}
    >
      {open ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistant-title"
          className="pointer-events-auto w-full md:w-[22.5rem] mb-3 overflow-hidden panel bg-surface"
        >
          <div className="flex items-start justify-between px-4 py-3 border-b border-white/10 bg-black">
            <div>
              <p id="assistant-title" className="text-sm font-bold tracking-tight text-white">
                Asesor del hogar
              </p>
              <p className="text-[0.7rem] text-white/60 mt-0.5">¿Qué necesitas resolver?</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => void send("Quiero volver atrás", true)}
                disabled={!assistantCanGoBack(state) || pending}
                className="min-h-11 px-3 text-xs text-white/60 hover:text-white disabled:opacity-30"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={clearChat}
                className="min-h-11 px-3 text-xs text-white/60 hover:text-white"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setOpenSafe(false)}
                className="min-h-11 min-w-11 text-white/60 hover:text-white text-lg leading-none"
                aria-label="Cerrar asesor"
              >
                ×
              </button>
            </div>
          </div>

          <div ref={listRef} className="max-h-72 md:max-h-80 overflow-y-auto p-4 space-y-3" aria-live="polite">
            {items.map((item, i) => (
              <div key={`${item.role}-${i}`} className={item.role === "user" ? "text-right" : ""}>
                <p
                  className={`inline-block text-sm leading-relaxed whitespace-pre-wrap px-3 py-2 max-w-[95%] ${
                    item.role === "user"
                      ? "bg-brand text-black"
                      : "bg-black text-white border border-white/10"
                  }`}
                >
                  {item.text}
                </p>
                {item.ctas?.length ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.ctas.map((cta) => {
                      const external = cta.href.startsWith("http");
                      return (
                        <a
                          key={cta.href + cta.label}
                          href={cta.href}
                          className="inline-flex items-center min-h-11 text-[0.65rem] font-bold uppercase tracking-[0.12em] border border-white/25 px-3 text-white hover:border-brand"
                          onClick={() => {
                            if (!external) setOpenSafe(false);
                          }}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {cta.label}
                        </a>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => void send(chip.message, chip.label === "Atrás")}
                className="min-h-11 text-[0.7rem] border border-white/20 px-3 text-white/80 hover:text-white hover:border-brand"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <form
            className="flex border-t border-white/10 bg-black"
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-black px-4 py-3 text-base text-white placeholder:text-white/55"
            />
            <button
              type="submit"
              disabled={pending}
              className="min-h-11 px-4 text-brand text-xs font-bold uppercase tracking-[0.16em] disabled:opacity-40"
            >
              Enviar
            </button>
          </form>
        </div>
      ) : null}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpenSafe((value) => !value)}
        className="pointer-events-auto hidden md:inline-flex min-h-11 bg-black border border-white/40 text-white px-4 py-2.5 text-sm font-medium hover:border-brand transition-colors"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="assistant-title"
        aria-label={open ? "Cerrar asesor del hogar" : "Abrir asesor del hogar"}
      >
        Asesor del hogar
      </button>
    </div>
  );
}
