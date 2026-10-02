import { z } from "zod";

export const Report = z.object({
  overall_score: z.number().describe("0-100"),
  headline: z.string().describe("A short, fun title for how the day went, e.g. 'The Calm Firefighter'"),
  fit_summary: z.string().describe("2-3 sentences on whether this career seems like a good fit and why"),
  skills: z.array(
    z.object({
      name: z.string(),
      score: z.number().describe("1-10"),
      comment: z.string(),
    }),
  ),
  highlights: z.array(z.string()),
  improvements: z.array(z.string()),
  task_feedback: z.array(z.object({ task_id: z.string(), feedback: z.string() })),
  next_steps: z.array(z.string()),
});

export type ReportData = z.infer<typeof Report>;
