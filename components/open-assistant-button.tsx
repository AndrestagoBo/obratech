"use client";

export const OPEN_ASSISTANT_EVENT = "obratech-open-assistant";

export function openAssistant() {
  window.dispatchEvent(new Event(OPEN_ASSISTANT_EVENT));
}

export function OpenAssistantButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={openAssistant}>
      {children}
    </button>
  );
}
