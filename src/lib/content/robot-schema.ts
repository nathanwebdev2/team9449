import { z } from "zod";

export const robotSchema = z.object({
  slug: z.string().default(""),
  year: z.number().default(0),
  name: z.string().default(""),
  game: z.string().default(""),
  tagline: z.string().default(""),
  status: z.enum(["competed", "retired", "demo"]).default("demo"),

  weightLb: z.number().nullable().default(null),
  drivetrain: z.string().nullable().default(null),
  motorCount: z.number().nullable().default(null),
  notableMechanisms: z.array(z.string()).default([]),

  cadUrl: z.string().nullable().default(null),
  codeUrl: z.string().nullable().default(null),
  binderUrl: z.string().nullable().default(null),

  heroImage: z.string().nullable().default(null),
  gallery: z.array(z.string()).default([]),

  tbaTeamKey: z.string().default(""),
});

export type Robot = z.infer<typeof robotSchema>;
