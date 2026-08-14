import type { ReactNode } from "react";

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`font-mono text-label uppercase tracking-widest text-steel-400 ${className}`}>
      {children}
    </p>
  );
}
