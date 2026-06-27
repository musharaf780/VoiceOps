export const WORKER = {
  id: 'W1', name: 'James Torres', initials: 'JT', role: 'worker',
  company: 'ConstructCo Ltd.',
  stats: { today: 3, thisWeek: 12, streak: 5 },
};

export const MANAGER = {
  id: 'M1', name: 'Alex Rivera', initials: 'AR', role: 'manager',
  company: 'ConstructCo Ltd.',
  stats: { todayTotal: 8, unread: 3, critical: 1 },
};

export const REPORTS = [
  {
    id: 'RPT-001', workerId: 'W1', workerName: 'James Torres', workerInitials: 'JT',
    site: 'Building C', issueType: 'Equipment malfunction', component: 'Generator / cooling fan',
    urgency: 'CRITICAL',
    summary: 'Generator making loud noise, cooling fan appears damaged',
    transcript: '"Generator at Building C has been making a loud noise since this morning. Cooling fan looks damaged. Someone should check before end of shift."',
    audioDuration: '0:18', timestamp: '2m ago', timestampFull: '09:22 AM', isRead: false,
    actionItems: [
      { id: 'A1', text: 'Inspect cooling fan before end of shift', done: false },
      { id: 'A2', text: 'Check generator power output levels', done: false },
    ],
    automations: [
      { type: 'email', emoji: '📧', label: 'Email sent to you — Building C report', time: '09:22:14 AM' },
      { type: 'whatsapp', emoji: '💬', label: 'WhatsApp alert sent', time: '09:22:15 AM' },
    ],
  },
  {
    id: 'RPT-002', workerId: 'W2', workerName: 'Maria Chen', workerInitials: 'MC',
    site: 'Loading Dock B', issueType: 'Mechanical failure', component: 'Hydraulic lift',
    urgency: 'HIGH',
    summary: 'Hydraulic lift not responding. 3 vehicles blocked at dock.',
    transcript: '"The hydraulic lift at loading dock B is completely unresponsive. Three vehicles are waiting and we cannot unload. This is blocking operations."',
    audioDuration: '0:22', timestamp: '18m ago', timestampFull: '09:06 AM', isRead: false,
    actionItems: [
      { id: 'A3', text: 'Call hydraulic systems maintenance', done: false },
      { id: 'A4', text: 'Redirect vehicles to Dock A temporarily', done: true },
    ],
    automations: [
      { type: 'email', emoji: '📧', label: 'Email sent to you — Dock B report', time: '09:06:44 AM' },
    ],
  },
  {
    id: 'RPT-003', workerId: 'W3', workerName: 'Derek Williams', workerInitials: 'DW',
    site: 'West Wing', issueType: 'Electrical', component: 'Emergency exit lighting',
    urgency: 'MEDIUM',
    summary: 'Stairwell B emergency exit light battery critically low.',
    transcript: '"West wing stairwell B, the emergency exit light is showing a red fault indicator. Needs replacing before safety inspection Friday."',
    audioDuration: '0:15', timestamp: '41m ago', timestampFull: '08:43 AM', isRead: true,
    actionItems: [{ id: 'A5', text: 'Replace emergency light battery', done: false }],
    automations: [],
  },
  {
    id: 'RPT-004', workerId: 'W4', workerName: 'Sarah Kim', workerInitials: 'SK',
    site: 'Cafeteria', issueType: 'HVAC / Refrigeration', component: 'Refrigeration unit',
    urgency: 'LOW',
    summary: 'Cafeteria fridge running 3° above threshold. Food safety risk.',
    transcript: '"The main refrigeration unit in the cafeteria is showing 41°F — 3 degrees above threshold. Not critical yet but needs monitoring."',
    audioDuration: '0:20', timestamp: '1h 12m ago', timestampFull: '08:12 AM', isRead: true,
    actionItems: [
      { id: 'A6', text: 'Monitor temperature every 30 minutes', done: false },
      { id: 'A7', text: 'Contact refrigeration service if above 45°F', done: false },
    ],
    automations: [],
  },
];

export const URGENCY = {
  CRITICAL: { color: '#F75A5A', bg: 'rgba(247,90,90,0.14)', stripe: '#F75A5A' },
  HIGH:     { color: '#F75A5A', bg: 'rgba(247,90,90,0.14)', stripe: '#F75A5A' },
  MEDIUM:   { color: '#F7A94F', bg: 'rgba(247,169,79,0.14)', stripe: '#F7A94F' },
  LOW:      { color: '#4FBF85', bg: 'rgba(79,191,133,0.14)', stripe: '#4FBF85' },
};
