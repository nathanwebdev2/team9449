import type { ElementType, ReactNode } from "react";

export function Eyebrow({
  children,
  className = "",
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag className={`font-mono text-label uppercase tracking-widest text-steel-400 ${className}`}>
      {children}
    </Tag>
  );
}
