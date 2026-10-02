import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-opus-5-5";

// If Claude declines a request, the API automatically retries it on a recommended backup model.
export const FALLBACK: { betas: Anthropic.Beta.AnthropicBeta[]; fallbacks: "default" } = {
  betas: ["server-side-fallback-2026-07-01"],
  fallbacks: "default",
};

let client: Anthropic | null = null;

export function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new MissingKeyError();
  }
  client ??= new Anthropic();
  return client;
}

class MissingKeyError extends Error {}

// Turn any error into a message a user can act on.
export function errorResponse(err: unknown): Response {
  let message = "Something went wrong talking to the AI. Please try again.";
  if (err instanceof MissingKeyError || err instanceof Anthropic.AuthenticationError) {
    message = "The AI isn't set up yet: add a valid ANTHROPIC_API_KEY (in .env.local on your computer, or in Vercel settings online).";
  } else if (err instanceof Anthropic.RateLimitError) {
    message = "Too many requests right now. Wait a few seconds and try again.";
  } else if (err instanceof Anthropic.APIError) {
    console.error(`Claude API error ${err.status}:`, err.message);
    if (err.status === 400 && /credit/i.test(err.message)) {
      message = "Your Anthropic account is out of credit. Add credit at console.anthropic.com.";
    }
  } else {
    console.error(err);
  }
  return Response.json({ error: message }, { status: 500 });
}

// Optional gate: if ACCESS_CODE is set on the server, players must enter it to use the AI.
export function checkAccess(req: Request): Response | null {
  const code = process.env.ACCESS_CODE;
  if (!code || req.headers.get("x-access-code") === code) return null;
  return Response.json({ error: "Access code required" }, { status: 401 });
}
