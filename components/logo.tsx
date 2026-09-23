import Image from "next/image";

type LogoObraTechProps = {
  className?: string;
  preload?: boolean;
};

export function LogoObraTech({
  className = "h-10 w-auto md:h-11",
  preload = false,
}: LogoObraTechProps) {
  return (
    <Image
      src="/images/logo.png"
      alt="ObraTech Bogotá"
      width={1024}
      height={341}
      className={`${className} mix-blend-lighten`}
      style={{ width: "auto" }}
      preload={preload}
    />
  );
}
