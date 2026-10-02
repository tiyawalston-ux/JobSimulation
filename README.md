# Day One: Try a Career

A web app (works on laptop and phone) that lets people live a simulated day on the job: an inbox, live meetings with AI coworkers, decisions, and an end-of-day report.

## Run it on your computer

1. Install [Node.js](https://nodejs.org) (LTS).
2. In this folder, install packages: `npm install`
3. Copy `.env.example` to `.env.local` and paste your key from [console.anthropic.com](https://console.anthropic.com).
4. Start the app: `npm run dev`
5. Open http://localhost:3000

## Where things live

- `lib/careers.ts`: all career content (tasks, emails, AI coworker personalities). Add new careers here.
- `app/api/meeting/route.ts`: runs the AI coworkers in meetings.
- `app/api/report/route.ts`: writes the end-of-day report.
- `components/`: the screens (simulation day, task types, report).
- `app/globals.css`: all styling.
