import Image from "next/image";
import Link from "next/link";

type NexaLogoProps = {
  href?: string;
  showText?: boolean;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  className?: string;
};

const sizes = {
  sm: {
    image: 32,
    box: "h-8 w-8",
    title: "text-xs",
    subtitle: "text-[9px]",
  },
  md: {
    image: 40,
    box: "h-10 w-10",
    title: "text-sm",
    subtitle: "text-[10px]",
  },
  lg: {
    image: 52,
    box: "h-[52px] w-[52px]",
    title: "text-base",
    subtitle: "text-[11px]",
  },
};

export function NexaLogo({
  href = "/",
  showText = true,
  subtitle = "Your utility workspace",
  size = "md",
  priority = false,
  className = "",
}: NexaLogoProps) {
  const config = sizes[size];

  const content = (
    <span className={["inline-flex items-center gap-3", className].filter(Boolean).join(" ")}>
      <span className={[config.box, "inline-flex shrink-0 overflow-hidden rounded-xl"].join(" ")}>
        <Image
          src="/brand/nexa-logo.png"
          alt="Nexa Utility"
          width={config.image}
          height={config.image}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </span>
      {showText && (
        <span className="flex min-w-0 flex-col">
          <span className={[config.title, "truncate font-semibold text-foreground"].join(" ")}>
            Nexa Utility
          </span>
          {subtitle && (
            <span className={[config.subtitle, "truncate text-muted-foreground"].join(" ")}>
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="Nexa Utility home" className="inline-flex">
      {content}
    </Link>
  );
}
