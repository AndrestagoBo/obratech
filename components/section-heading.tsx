type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "left" | "right" | "center";
  size?: "lg" | "sm";
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  size = "lg",
}: SectionHeadingProps) {
  const alignClass =
    align === "right" ? "text-right ml-auto" : align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`${size === "sm" ? "mb-8 md:mb-10" : "mb-12 md:mb-16"} max-w-4xl ${alignClass}`}>
      <p className="section-eyebrow mb-4">{eyebrow}</p>
      <h2 className={size === "sm" ? "section-title-sm" : "section-title"}>{title}</h2>
      {lead ? <p className={`section-lead ${align === "right" ? "ml-auto" : align === "center" ? "mx-auto" : ""}`}>{lead}</p> : null}
    </div>
  );
}
