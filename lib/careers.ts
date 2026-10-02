// All career content lives here. Adding a new career = adding a new entry to CAREERS.

export type Persona = {
  name: string;
  role: string;
  personality: string; // how the AI should play this character
};

export type Email = {
  id: string;
  from: string;
  subject: string;
  body: string;
};

export type InboxTask = {
  type: "inbox";
  id: string;
  time: string;
  title: string;
  brief: string;
  emails: Email[];
  actions?: { id: string; label: string }[]; // buttons for each message (defaults to INBOX_ACTIONS)
  doneLabel?: string;
};

export type MeetingTask = {
  type: "meeting";
  id: string;
  time: string;
  title: string;
  brief: string;
  goal: string;
  situation: string; // private context the AI coworkers know
  personas: Persona[];
  maxTurns: number;
};

export type WritingTask = {
  type: "writing";
  id: string;
  time: string;
  title: string;
  brief: string;
  facts: string[];
  prompt: string;
  placeholder: string;
};

export type DecisionTask = {
  type: "decision";
  id: string;
  time: string;
  title: string;
  brief: string;
  message: { from: string; text: string };
  options: { id: string; label: string }[];
};

export type Task = InboxTask | MeetingTask | WritingTask | DecisionTask;

export type Career = {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  available: boolean;
  company?: string;
  yourRole?: string;
  setting?: string; // shared background for every AI call
  intro?: string; // welcome text shown before the day starts
  endTime?: string; // when the end-of-day report happens
  skillsHint?: string; // which skills the report should score
  tasks: Task[];
};

export const INBOX_ACTIONS = [
  { id: "now", label: "Handle now" },
  { id: "delegate", label: "Delegate" },
  { id: "later", label: "Schedule later" },
  { id: "ignore", label: "Ignore" },
];

export function inboxActions(task: InboxTask) {
  return task.actions ?? INBOX_ACTIONS;
}

const PRIYA: Persona = {
  name: "Priya",
  role: "Engineering Lead",
  personality:
    "Blunt, practical, protective of her team's time. Hates vague answers and pushes back on unrealistic deadlines. Respects people who make clear decisions.",
};
const MARCUS: Persona = {
  name: "Marcus",
  role: "Product Designer",
  personality:
    "Enthusiastic and creative, always pitching 'one small extra idea' (scope creep). Gets a little deflated if shut down harshly, but responds well to being heard.",
};
const DANA: Persona = {
  name: "Dana",
  role: "QA Tester",
  personality:
    "Careful and a bit anxious. Worried about the login bug and the testing timeline. Speaks up only when asked directly or when quality is at risk.",
};
const LINDA: Persona = {
  name: "Linda Park",
  role: "VP of Operations at the client, Brightline Health",
  personality:
    "Demanding, busy, and frustrated about the vendor delay. Wants a new 'appointment reminder by text message' feature added before launch without moving the date. Can be won over by honesty, clear options, and confidence, but pushes hard on anyone who seems unsure.",
};

export const CAREERS: Career[] = [
  {
    id: "project-manager",
    title: "Project Manager",
    emoji: "📋",
    tagline: "Keep a team, a client, and a deadline all moving in the same direction.",
    available: true,
    company: "Northwind Digital",
    yourRole: "Project Manager",
    endTime: "5:00 PM",
    skillsHint: "prioritization, communication, stakeholder management, decision-making, handling scope creep",
    intro:
      "You're the new Project Manager for Project Atlas, a patient appointment app launching in 3 weeks. Your team is talented, your client is demanding, and today, things are going to go a little sideways.",
    setting:
      "Northwind Digital is a small software agency. The player is the Project Manager for 'Project Atlas', a patient appointment-booking mobile app being built for the client Brightline Health. Launch is scheduled in 3 weeks. Today's problems: (1) a third-party scheduling API vendor is delayed by one week, (2) QA found a bug where some users can't log in, (3) the client wants to add a text-message reminder feature before launch.",
    tasks: [
      {
        type: "inbox",
        id: "inbox",
        time: "9:00 AM",
        title: "Morning inbox triage",
        brief:
          "You just sat down with your coffee and there are 5 new messages. Decide what to do with each one. A good PM doesn't do everything at once. They prioritize.",
        emails: [
          {
            id: "ceo",
            from: "Tom Reyes (CEO)",
            subject: "Atlas status before noon?",
            body: "Hey, I have a call with Brightline's CEO this afternoon. Can you send me a quick status on Atlas before noon? Mainly: are we still launching on time?",
          },
          {
            id: "vendor",
            from: "Priya (Engineering Lead)",
            subject: "Scheduling API vendor delayed",
            body: "Just heard from the vendor. Their scheduling API won't be ready for another week. That blocks the booking screen. We need to talk about this at standup.",
          },
          {
            id: "bug",
            from: "Dana (QA)",
            subject: "URGENT: login failing for some users",
            body: "About 1 in 5 test accounts can't log in on Android. Haven't found the cause yet. This would be a launch blocker if real users hit it.",
          },
          {
            id: "design",
            from: "Marcus (Design)",
            subject: "New mockups for settings page 🎨",
            body: "Finished some new ideas for the settings page, including a dark mode! Would love your thoughts whenever you get a chance.",
          },
          {
            id: "hr",
            from: "HR Team",
            subject: "Reminder: annual compliance training",
            body: "Friendly reminder that your annual compliance training is due by the end of the month. It takes about 45 minutes.",
          },
        ],
      },
      {
        type: "meeting",
        id: "standup",
        time: "9:30 AM",
        title: "Daily standup with your team",
        brief:
          "Your 15-minute daily check-in with the team. Find out what's blocking people and make decisions so they can keep working.",
        goal:
          "Learn the status of the vendor delay and login bug, decide what the team should focus on today, and keep scope under control.",
        situation:
          "Priya has a workaround idea: her team could build a temporary 'request a callback' screen instead of live booking, but it would take 3 days. Dana needs at least one developer to help debug the Android login issue. Marcus wants to sneak dark mode into this release. The team has 4 developers total.",
        personas: [PRIYA, MARCUS, DANA],
        maxTurns: 6,
      },
      {
        type: "writing",
        id: "status",
        time: "11:00 AM",
        title: "Write a status update for the CEO",
        brief:
          "The CEO asked for an update before noon. Executives are busy, so keep it short, honest, and clear.",
        facts: [
          "Launch date: 3 weeks from today",
          "Scheduling API vendor is 1 week late, which blocks the booking screen",
          "Possible workaround: temporary 'request a callback' screen (3 days of work)",
          "Android login bug affects ~20% of test accounts, cause unknown",
          "Everything else (profiles, notifications, design) is on track",
        ],
        prompt:
          "Write a short status update to Tom (the CEO). Include: overall status (on track / at risk / off track), the key risks, what you're doing about them, and anything you need from him.",
        placeholder: "Hi Tom,\n\nQuick update on Atlas...",
      },
      {
        type: "meeting",
        id: "client",
        time: "1:00 PM",
        title: "Client call with Brightline Health",
        brief:
          "Your weekly call with the client. They've heard about the delay and they also have a new request. Stay calm, be honest, and protect the project.",
        goal:
          "Explain the delay honestly, handle the new feature request without blindly saying yes, and leave the client feeling confident.",
        situation:
          "The text-reminder feature would realistically take about 2 weeks to build and test. The team cannot add it AND launch on time. Reasonable options: launch on time and add text reminders in a 'phase 2' update ~1 month after launch; push the launch date; or drop something else. Linda opens the call by asking about the delay.",
        personas: [LINDA],
        maxTurns: 6,
      },
      {
        type: "decision",
        id: "curveball",
        time: "3:30 PM",
        title: "Curveball!",
        brief: "Just when the day was settling down...",
        message: {
          from: "Priya (Engineering Lead)",
          text: "Bad news. Jordan, one of our 4 devs, just went home sick and will probably be out the rest of the week. We can't finish the callback workaround AND fix the login bug this week with 3 people. What do you want us to prioritize?",
        },
        options: [
          { id: "bug", label: "Fix the login bug first; delay the callback workaround" },
          { id: "workaround", label: "Build the callback workaround first; leave the bug for next week" },
          { id: "overtime", label: "Ask the team to work overtime to do both" },
          { id: "contractor", label: "Ask the CEO for budget to bring in a contractor" },
        ],
      },
    ],
  },
  {
    id: "nurse",
    title: "Registered Nurse",
    emoji: "🩺",
    tagline: "Care for patients through a busy hospital shift.",
    available: true,
    company: "Riverside General Hospital",
    yourRole: "Registered Nurse",
    endTime: "7:00 PM",
    skillsHint:
      "prioritizing patients by urgency (airway, breathing, circulation, safety), clinical communication (SBAR), delegation, documentation, staying calm under pressure, compassion",
    intro:
      "You're a Registered Nurse on the medical-surgical floor at Riverside General, working a 12-hour day shift. You have 4 patients today, and one of them is about to get worse. (This is a simplified simulation to explore the job, not medical training.)",
    setting:
      "Riverside General Hospital, 4th floor medical-surgical unit, day shift (7 AM - 7 PM). The player is a Registered Nurse with 4 patients: Room 412, Harold Jensen, 72, day 1 after hip replacement surgery, in pain. Room 414, Alicia Gomez, 45, admitted with pneumonia, on 2 liters of oxygen; her oxygen levels have been slipping. Room 416, Dev Patel, 58, diabetic, had low blood sugar overnight, needs blood sugar checks before meals. Room 418, Ruth Kim, 86, confused overnight and at high risk of falling. The player has a nursing aide (CNA) named Tasha who can help with things like vital signs, meal trays, walking patients, and toileting, but not with assessments or medications. This is a simplified educational simulation; keep medical details realistic but accessible to a non-nurse.",
    tasks: [
      {
        type: "meeting",
        id: "handoff",
        time: "7:00 AM",
        title: "Shift handoff from the night nurse",
        brief:
          "Before the night nurse goes home, they 'hand off' your patients to you. Whatever you don't find out now, you'll have to discover the hard way.",
        goal:
          "Get the important information on all 4 patients. Ask questions about anything that sounds off. The night nurse is tired and won't volunteer everything.",
        situation:
          "Kevin is finishing a 12-hour night shift and wants to go home. He gives a quick, surface-level report and only shares these details if the player asks relevant follow-up questions: (1) Ms. Gomez's oxygen level dropped to 89% around 5 AM (normal is 92%+); he turned her oxygen up slightly but has NOT told the doctor yet. (2) Mr. Jensen last got pain medication at 4 AM, so he's due around 8 AM. (3) Mr. Patel's blood sugar was low (62) at 3 AM; Kevin gave him juice and it came back up to 110. (4) Mrs. Kim tried to climb out of bed twice overnight, and her bed alarm wasn't turned on until 2 AM.",
        personas: [
          {
            name: "Kevin",
            role: "Night shift nurse",
            personality:
              "Friendly but exhausted after a 12-hour night shift. Talks fast, glosses over details, and says things like 'everyone's basically fine.' Answers questions honestly when asked directly. Gets a bit defensive if the player is accusatory, but appreciates thorough questions from a good nurse.",
          },
        ],
        maxTurns: 6,
      },
      {
        type: "inbox",
        id: "call-lights",
        time: "7:45 AM",
        title: "Call lights are going off",
        brief:
          "You've barely put your bag down and five things need you at once. You can only be in one place at a time. Decide who you go to first, who your aide Tasha can help, and what can wait.",
        actions: [
          { id: "now", label: "Go right now" },
          { id: "aide", label: "Send Tasha (aide)" },
          { id: "soon", label: "Within 30 min" },
          { id: "later", label: "Later today" },
        ],
        doneLabel: "Start my rounds →",
        emails: [
          {
            id: "gomez",
            from: "Room 414 · Alicia Gomez",
            subject: "Call light",
            body: "\"I feel like I can't catch my breath. It's worse than last night.\"",
          },
          {
            id: "kim",
            from: "Room 418 · Ruth Kim",
            subject: "🔔 Bed alarm",
            body: "Bed exit alarm is sounding. Mrs. Kim is sitting on the edge of the bed, trying to stand up.",
          },
          {
            id: "jensen",
            from: "Room 412 · Harold Jensen",
            subject: "Call light",
            body: "\"My hip is really hurting. About a 7 out of 10. Can I get something for the pain?\"",
          },
          {
            id: "patel",
            from: "Room 416 · Dev Patel",
            subject: "Call light",
            body: "\"Is my breakfast coming soon? I'm starving. Also, do you need to check my sugar first?\"",
          },
          {
            id: "pharmacy",
            from: "Pharmacy",
            subject: "Message",
            body: "Question about the dosing time on Mr. Jensen's blood thinner. Please call back when you have a moment.",
          },
        ],
      },
      {
        type: "meeting",
        id: "doctor",
        time: "8:30 AM",
        title: "Call the doctor about Ms. Gomez",
        brief:
          "Ms. Gomez is getting worse: oxygen level 88% even with extra oxygen, breathing fast (26 breaths/min), heart rate 108, and a fever of 101.1°F. You need to call the doctor and get a plan. Doctors are busy, so nurses use a format called SBAR: Situation, Background, Assessment, Recommendation.",
        goal:
          "Give the doctor a clear, quick report on Ms. Gomez (try SBAR), say what you think is going on, ask for what she needs, and confirm the orders back.",
        situation:
          "Dr. Okafor is covering 30 patients and is in the middle of another emergency. Facts about Ms. Gomez: 45 years old, admitted 2 days ago with pneumonia, on IV antibiotics. This morning: oxygen saturation 88% on 3 liters, respiratory rate 26, heart rate 108, temperature 101.1°F, blood pressure 118/76, using extra muscles to breathe, anxious. If the player gives a clear report and makes a reasonable request, Dr. Okafor will order: increase oxygen to keep saturation above 92%, a chest X-ray, blood work, and say she'll come see the patient within the hour, and to call back if she gets worse. If the report is disorganized or vague, Dr. Okafor gets impatient and asks pointed questions ('What's her sat? What do you want from me?').",
        personas: [
          {
            name: "Dr. Okafor",
            role: "Hospitalist (on-call doctor)",
            personality:
              "Sharp, rushed, and direct. Not mean, but has no time for rambling. Interrupts to ask for numbers. Warms up noticeably when a nurse gives a clean, organized report and a clear recommendation. Expects orders to be read back.",
          },
        ],
        maxTurns: 6,
      },
      {
        type: "writing",
        id: "charting",
        time: "11:00 AM",
        title: "Chart what happened with Ms. Gomez",
        brief:
          "In nursing, 'if it wasn't documented, it wasn't done.' Write a short nursing note about this morning's change in Ms. Gomez's condition. Other nurses and doctors will rely on it.",
        facts: [
          "7:50 AM: patient reported shortness of breath, 'worse than last night'",
          "8:15 AM: O2 sat 88% on 3L, breathing rate 26, heart rate 108, temp 101.1°F, BP 118/76",
          "8:30 AM: called Dr. Okafor; orders received for more oxygen, chest X-ray, and blood work",
          "8:45 AM: oxygen increased; sat now 93%; patient says breathing feels 'a little easier'",
          "9:30 AM: Dr. Okafor examined the patient; chest X-ray done",
        ],
        prompt:
          "Write a clear, factual nursing note: what you observed, what you did, who you told, and how the patient responded. Stick to facts, not opinions.",
        placeholder: "0750: Pt reports shortness of breath...",
      },
      {
        type: "decision",
        id: "curveball",
        time: "2:30 PM",
        title: "Curveball!",
        brief: "Two things happen in the same minute...",
        message: {
          from: "Tasha (Nursing aide)",
          text: "Hey, I just walked Mr. Jensen back to bed and his hip dressing is soaked through with blood. He looks pale and says he feels dizzy. Also the ER is on the phone, they want to give you report on a new admission coming to your room 420.",
        },
        options: [
          { id: "jensen", label: "Go assess Mr. Jensen now, and ask the charge nurse to take the ER call" },
          { id: "er", label: "Take the ER report first (it's quick), then go see Mr. Jensen" },
          { id: "aide", label: "Have Tasha take his vital signs while you finish the ER call" },
          { id: "doctor", label: "Page the doctor about Mr. Jensen before seeing him yourself" },
        ],
      },
    ],
  },
  { id: "software-engineer", title: "Software Engineer", emoji: "💻", tagline: "Ship features, squash bugs, and survive code review.", available: false, tasks: [] },
  { id: "ux-designer", title: "UX Designer", emoji: "🎨", tagline: "Turn messy user problems into simple designs.", available: false, tasks: [] },
  { id: "marketing-manager", title: "Marketing Manager", emoji: "📣", tagline: "Launch a campaign and prove it worked.", available: false, tasks: [] },
];

export function getCareer(id: string): Career | undefined {
  return CAREERS.find((c) => c.id === id);
}

// What the player did in each task, keyed by task id.
export type TranscriptLine = { speaker: string; text: string };
export type Answers = {
  [taskId: string]:
    | { type: "inbox"; actions: Record<string, string> }
    | { type: "meeting"; transcript: TranscriptLine[] }
    | { type: "writing"; text: string }
    | { type: "decision"; choice: string; reasoning: string };
};
