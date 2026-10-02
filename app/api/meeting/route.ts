import { z } from "zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { getCareer, type TranscriptLine } from "@/lib/careers";
import { FALLBACK, MODEL, checkAccess, errorResponse, getClient } from "@/lib/claude";

const MeetingReply = z.object({
  lines: z.array(z.object({ speaker: z.string(), text: z.string() })),
  meeting_over: z.boolean(),
});

export async function POST(req: Request) {
  const denied = checkAccess(req);
  if (denied) return denied;

  const { careerId, taskId, transcript } = (await req.json()) as {
    careerId: string;
    taskId: string;
    transcript: TranscriptLine[];
  };

  const career = getCareer(careerId);
  const task = career?.tasks.find((t) => t.id === taskId);
  if (!career || !task || task.type !== "meeting") {
    return Response.json({ error: "Unknown meeting" }, { status: 400 });
  }

  const playerTurns = transcript.filter((l) => l.speaker === "You").length;
  const turnsLeft = task.maxTurns - playerTurns;

  const system = `You are running a realistic workplace simulation. You play the AI coworkers in a meeting; the user plays the ${career.yourRole}.

Company background: ${career.setting}

Meeting: ${task.title}
What the player is trying to achieve: ${task.goal}
Private details your characters know: ${task.situation}

Characters you play:
${task.personas.map((p) => `- ${p.name} (${p.role}): ${p.personality}`).join("\n")}

How to respond:
- Reply with the next 1-3 lines of dialogue. Only characters listed above may speak, and use exactly their names as the speaker.
- Talk like real coworkers on a video call: short, natural, conversational sentences (usually 1-3 sentences per line). No stage directions or narration.
- React realistically to what the player says. Good decisions earn cooperation; vague or poor answers get pushback. Don't make it too easy, and never coach the player or break character.
- Stay in this workplace scenario even if the player goes off-topic; steer back like a real coworker would.
- Set meeting_over to true only when the meeting has reached a natural wrap-up, and in that case include brief goodbyes.`;

  const transcriptText = transcript.length
    ? transcript.map((l) => `${l.speaker}: ${l.text}`).join("\n")
    : "(The meeting is just starting. Open it naturally, in character.)";

  const pacing =
    turnsLeft <= 0
      ? "The meeting is out of time. Wrap it up now and set meeting_over to true."
      : turnsLeft === 1
        ? "Only about one exchange is left before time runs out, so start wrapping up."
        : "";

  try {
    const response = await getClient().beta.messages.parse({
      model: MODEL,
      max_tokens: 8000,
      ...FALLBACK,
      output_config: { effort: "low", format: betaZodOutputFormat(MeetingReply) },
      system,
      messages: [
        {
          role: "user",
          content: `Meeting transcript so far ("You" is the player):\n${transcriptText}\n\n${pacing}\nWrite the next lines.`,
        },
      ],
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return Response.json({ error: "The coworkers lost their train of thought. Try rephrasing." }, { status: 500 });
    }
    return Response.json(response.parsed_output);
  } catch (err) {
    return errorResponse(err);
  }
}
