import type { ElementType, ReactNode } from "react";

export function Section({
  children,
  className = "",
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Tag className={`py-24 md:py-32 ${className}`}>{children}</Tag>;
}
