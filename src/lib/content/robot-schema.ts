import { z } from "zod";

const PLACEHOLDER = "[TK]";

export const robotSchema = z.object({
  slug: z.string().default(""),
  year: z.number().default(0),
  name: z.string().default(""),
  game: z
    .string()
    .default("")
    .refine((value) => value.trim() !== PLACEHOLDER, {
      message: 'game must not be the literal placeholder "[TK]" — write real content or omit the field.',
    }),
  tagline: z
    .string()
    .default("")
    .refine((value) => value.trim() !== PLACEHOLDER, {
      message: 'tagline must not be the literal placeholder "[TK]" — write real content or omit the field.',
    }),
  status: z.enum(["competed", "retired", "demo"]).default("demo"),

  weightLb: z.number().nullable().default(null),
  drivetrain: z
    .string()
    .nullable()
    .default(null)
    .refine((value) => value === null || value.trim() !== PLACEHOLDER, {
      message: 'drivetrain must not be the literal placeholder "[TK]" — write real content or omit the field.',
    }),
  motorCount: z.number().nullable().default(null),
  notableMechanisms: z.array(z.string()).default([]),

  cadUrl: z
    .string()
    .nullable()
    .default(null)
    .refine((value) => value === null || !/\/(signin|login|signup)(\/|$|\?)/i.test(value), {
      message:
        "cadUrl must be a public, viewable CAD document link — sign-in/login/signup URLs are rejected. Omit the field until a real public document link exists.",
    }),
  codeUrl: z.string().nullable().default(null),
  binderUrl: z.string().nullable().default(null),

  heroImage: z
    .string()
    .nullable()
    .default(null)
    .refine((value) => value === null || (value.startsWith("/") && !/^https?:\/\//i.test(value)), {
      message:
        "heroImage must be a site-relative path beginning with \"/\" — external http:// or https:// URLs are rejected. Omit the field to fall back to auto-discovered photos.",
    }),

  tbaTeamKey: z.string().default(""),
});

export type Robot = z.infer<typeof robotSchema>;
