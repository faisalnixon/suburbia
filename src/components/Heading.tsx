import clsx from "clsx";

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xl" | "lg" | "md" | "sm" | "xs";
  children: React.ReactNode;
  className?: string;
};

export function Heading({
  as: Comp = "h1",
  className,
  children,
  size = "lg",
}: HeadingProps) {
  return (
    <Comp
      className={clsx(
        "font-sans uppercase font-extrabold",
        // size === "xl" && "~text-4xl/8xl",
        // size === "lg" && "~text-4xl/7xl",
        // size === "md" && "~text-3xl/5xl",
        // size === "sm" && "~text-2xl/4xl",
        // size === "xs" && "~text-lg/xl",
        size === "xl" &&
          "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl",
        size === "lg" && "text-[clamp(36px,5vw,72px)]",
        size === "md" && "text-[clamp(30px,5vw,48px)]",
        size === "sm" && "text-[clamp(24px,5vw,36px)]",
        size === "xs" && "text-[clamp(18px,5vw,20px)]",
        className
      )}
    >
      {children}
    </Comp>
  );
}
