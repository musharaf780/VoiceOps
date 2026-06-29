const OPENAI_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

function getCurrentTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export async function extractFieldReport(transcript, workerInfo) {
  const { workerId, workerName, workerInitials } = workerInfo;
  const currentTime = getCurrentTime();

  const SYSTEM_PROMPT = `You are a field report extraction engine for construction and facilities management.

Extract structured data from the voice transcript and return ONLY raw valid JSON — no markdown, no backticks, no explanation.

Rules:
- id: Generate as "RPT-" + random 3-digit number
- workerId: Use exactly "${workerId}"
- workerName: Use exactly "${workerName}"
- workerInitials: Use exactly "${workerInitials}"
- site: Extract location/building from transcript. If none → "Unknown Site"
- issueType: One of: "Equipment malfunction" | "Structural damage" | "Safety hazard" | "Electrical issue" | "Plumbing issue" | "HVAC issue" | "General maintenance" | "Other"
- component: Specific equipment or part mentioned
- urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" — based on safety risk and time pressure
- summary: One sentence, max 15 words
- transcript: The original transcript verbatim in quotes
- audioDuration: Estimate from word count (avg 130 words/min), format "M:SS"
- timestamp: Always "Just now"
- timestampFull: Use exactly "${currentTime}"
- isRead: Always false
- actionItems: 2-3 concrete action items from the report. Each: { id: "A1", text: "...", done: false }
- automations: Always exactly:
  [
    { type: "email", emoji: "📧", label: "Email sent to you — [site] report", time: "${currentTime}" },
    { type: "whatsapp", emoji: "💬", label: "WhatsApp alert sent", time: "${currentTime}" }
  ]`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Extract a field report from this transcript: "${transcript}"` },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message ?? `GPT error ${response.status}`);
  }

  const data = await response.json();
  const raw = data.choices[0].message.content.trim();
  return JSON.parse(raw);
}
