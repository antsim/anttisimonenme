export interface CommandInfo {
  name: string;
  /** Description in the desktop `help` table. */
  description: string;
  /** Shorter description used on narrow screens. */
  short: string;
}

/** Commands listed by `help`, in display order. */
export const COMMANDS: CommandInfo[] = [
  { name: 'cv', description: 'Full curriculum vitae — start here', short: 'Full CV' },
  { name: 'whoami', description: 'Who I am, in one paragraph', short: 'About me' },
  { name: 'experience', description: 'Roles and responsibilities, newest first', short: 'Roles, newest first' },
  { name: 'skills', description: 'Architecture, .NET/C#, Angular, AI-assisted dev', short: 'Tech & architecture' },
  { name: 'projects', description: 'Selected work and case studies', short: 'Selected work' },
  { name: 'contact', description: 'Email, LinkedIn, GitHub', short: 'Get in touch' },
  { name: 'download cv', description: 'Get the CV as a PDF', short: 'PDF version' },
  { name: 'clear', description: 'Clear the screen', short: 'Clear screen' },
];

/** Everything Tab can complete to. */
export const COMPLETIONS: string[] = [
  'help',
  'cv',
  'whoami',
  'experience',
  'experience --full',
  'skills',
  'projects',
  'contact',
  'download cv',
  'clear',
];

/** Quick-command chips next to / below the terminal. */
export const QUICK_COMMANDS = ['help', 'cv', 'skills', 'projects', 'contact'];
export const MOBILE_QUICK_COMMANDS = ['cv', 'skills', 'projects', 'contact'];

export type OutputKind =
  | 'banner'
  | 'empty'
  | 'help'
  | 'cv'
  | 'cv-more'
  | 'whoami'
  | 'experience'
  | 'experience-full'
  | 'skills'
  | 'projects'
  | 'contact'
  | 'download'
  | 'completions'
  | 'not-found';

export interface TerminalEntry {
  id: number;
  /** The command line as typed, or null for output without an echoed prompt. */
  input: string | null;
  kind: OutputKind;
  /** Extra data, e.g. completion candidates. */
  items?: string[];
}

/** Longest common prefix of the given strings. */
export function commonPrefix(values: string[]): string {
  if (!values.length) return '';
  let prefix = values[0];
  for (const value of values.slice(1)) {
    while (!value.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}
