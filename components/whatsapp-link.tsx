import type { AnchorHTMLAttributes, ReactNode } from "react";
import { whatsappUrl } from "@/lib/content";

type WhatsAppLinkProps = {
  children: ReactNode;
  className?: string;
  servicio?: string;
  number: string;
  "aria-label"?: string;
  onClick?: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"];
};

export function WhatsAppLink({
  children,
  className,
  servicio,
  number,
  "aria-label": ariaLabel,
  onClick,
}: WhatsAppLinkProps) {
  return (
    <a
      href={whatsappUrl(number, servicio)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
