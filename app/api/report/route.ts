import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { getCareer, inboxActions, type Answers, type Task } from "@/lib/careers";
import { FALLBACK, MODEL, errorResponse, getClient } from "@/lib/claude";
import { Report } from "@/lib/report";

function describeAnswer(task: Task, answers: Answers): string {
  const a = answers[task.id];
  const header = `## [${task.id}] ${task.time} - ${task.title}`;
  if (!a) return `${header}\n(Skipped)`;

  switch (task.type) {
    case "inbox": {
      if (a.type !== "inbox") break;
      const label = (id: string) => inboxActions(task).find((x) => x.id === id)?.label ?? "No decision";
      return `${header}\n${task.emails
        .map((e) => `- "${e.subject}" from ${e.from} -> ${label(a.actions[e.id])}`)
        .join("\n")}`;
    }
    case "meeting": {
      if (a.type !== "meeting") break;
      return `${header}\nGoal: ${task.goal}\nHidden context: ${task.situation}\nTranscript:\n${a.transcript
        .map((l) => `${l.speaker}: ${l.text}`)
        .join("\n")}`;
    }
    case "writing": {
      if (a.type !== "writing") break;
      return `${header}\nAssignment: ${task.prompt}\nFacts given: ${task.facts.join("; ")}\nWhat they wrote:\n${a.text}`;
    }
    case "decision": {
      if (a.type !== "decision") break;
      const choice = task.options.find((o) => o.id === a.choice)?.label ?? a.choice;
      return `${header}\nSituation: ${task.message.text}\nChoice: ${choice}\nTheir reasoning: ${a.reasoning || "(none given)"}`;
    }
  }
  return `${header}\n(Skipped)`;
}

export async function POST(req: Request) {
  const { careerId, answers } = (await req.json()) as { careerId: string; answers: Answers };
  const career = getCareer(careerId);
  if (!career || !career.available) {
    return Response.json({ error: "Unknown career" }, { status: 400 });
  }

  const dayLog = career.tasks.map((t) => describeAnswer(t, answers)).join("\n\n");

  try {
    const response = await getClient().beta.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      ...FALLBACK,
      output_config: { effort: "medium", format: betaZodOutputFormat(Report) },
      system: `You are an experienced, encouraging career coach and a veteran ${career.title}. Someone just finished a simulated day on the job to explore whether this career is right for them. They are likely new to the field, so judge them as a promising beginner, not a 20-year veteran.

Background of the simulation: ${career.setting}

Write their end-of-day report:
- Be honest but kind. Point to specific things they actually said or did.
- Score 4-6 skills that matter most in this job (for example: ${career.skillsHint}).
- Give feedback for every task, using its task id exactly as shown in brackets.
- Skipped tasks should lower the relevant scores, but mention it gently.
- next_steps should be concrete ways to explore this career further in real life (courses, certifications, people to talk to, things to try).`,
      messages: [{ role: "user", content: `Here is everything they did today:\n\n${dayLog}` }],
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return Response.json({ error: "Couldn't generate your report. Please try again." }, { status: 500 });
    }
    return Response.json(response.parsed_output);
  } catch (err) {
    return errorResponse(err);
  }
}
