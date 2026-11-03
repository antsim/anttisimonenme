/**
 * Single source of truth for all CV content on the site.
 * Both the terminal (`cv`, `experience`, `skills`, …) and the plain-HTML CV at /cv
 * render from this file, so they never drift apart.
 *
 * Anything in [BRACKETS] is a placeholder still to be filled in.
 * Placeholders are detected by `isPlaceholder()` and rendered in a muted/dashed style.
 */

export interface Role {
  title: string;
  /** 'YYYY' or 'YYYY-MM' */
  start: string;
  /** 'YYYY' or 'YYYY-MM', or null for a current role */
  end: string | null;
  location: string;
  /** One line on scope and impact, shown in the CV overview. */
  summary: string;
  /** Extra detail, shown by `experience --full` and on the plain CV page. */
  highlights: string[];
}

export interface Employer {
  company: string;
  roles: Role[];
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  startYear: number;
  endYear: number;
  note?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
}

export interface Project {
  name: string;
  summary: string;
  tags: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface CvData {
  name: string;
  title: string;
  location: string;
  /** Short location used in the eyebrow and CV header. */
  country: string;
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  /** Path of the downloadable CV PDF (served from /public). */
  pdfUrl: string;
  /** Intro paragraph in the left column of the landing page. */
  intro: string;
  /** Output of `whoami` and the About section on /cv, one string per paragraph. */
  about: string[];
  profile: string;
  coreStack: string[];
  skills: SkillGroup[];
  experience: Employer[];
  education: Education[];
  certifications: Certification[];
  languages: { language: string; level: string }[];
  projects: Project[];
}

export const CV: CvData = {
  name: 'Antti Simonen',
  title: 'Software Architect',
  location: 'Tampere, Finland',
  country: 'Finland',
  email: 'info@anttisimonen.me',
  linkedinUrl: 'https://www.linkedin.com/in/anttisimonen',
  githubUrl: 'https://github.com/antsim',
  pdfUrl: '/antti-simonen-cv.pdf',

  intro:
    'Software architect specialising in .NET/C# and Angular, currently exploring what AI-assisted development means for how we design systems.',

  about: [
    'I’m a software architect at Gofore in Tampere. I’ve been building software for about 20 years, mostly on the Microsoft stack.',
    'These days that means .NET/C# on the back end and Angular on the front end. At Gofore I’ve helped develop several major information systems for the Finnish public sector.',
    'Before that I spent six years at OpusCapita working on Liquidity, an enterprise cash management solution. I started as a developer and Scrum Master and moved into a team manager role in 2013.',
    'Right now I’m most interested in AI-assisted development. I’m trying to figure out how it actually changes the way we design and build systems, and what it means for architecture.',
    'I’m a Certified ScrumMaster with an MBA, so I’m pretty comfortable moving between code, teams and business goals.',
    'Outside work I play metal guitar and study Italian.',
  ],

  profile:
    'Software architect with 20 years of building on the Microsoft stack, from the first ASP.NET web apps to modern ' +
    '.NET/C# back ends and Angular front ends. Certified ScrumMaster and MBA, comfortable moving between code, teams ' +
    'and business goals. Currently focused on how AI-assisted development changes the way systems are designed and delivered.',

  coreStack: [
    '.NET / C#',
    'Angular',
    'ASP.NET',
    'SQL Server',
    'Software architecture',
    'AI-assisted development',
    'Scrum & agile',
  ],

  skills: [
    { label: 'Architecture', items: ['Software architecture', 'Azure', 'Cloudflare'] },
    { label: 'Backend', items: ['.NET / C#', 'ASP.NET', 'SQL Server'] },
    { label: 'Frontend', items: ['Angular'] },
    { label: 'AI-assisted dev', items: ['AI-assisted development', 'Claude', 'Gemini'] },
    { label: 'Ways of working', items: ['Scrum & agile', 'Certified ScrumMaster®'] },
  ],

  experience: [
    {
      company: 'Gofore Finland Oy',
      roles: [
        {
          title: 'Software Architect',
          start: '2016',
          end: null,
          location: 'Tampere, Finland',
          summary: 'Architecture and technical direction for .NET/C# and Angular systems.',
          highlights: ['Has helped develop several major information systems for the Finnish public sector.'],
        },
      ],
    },
    {
      company: 'OpusCapita Oy',
      roles: [
        {
          title: 'Team Manager & Developer',
          start: '2010',
          end: '2016',
          location: 'Tampere, Finland',
          summary: 'Software developer and Scrum Master building Liquidity, an enterprise cash management solution.',
          highlights: ['Moved into a team manager role in 2013.'],
        },
      ],
    },
  ],

  education: [
    {
      degree: 'MBA',
      field: 'Entrepreneurship & Business Management',
      institution: 'Satakunta University of Applied Sciences, Pori',
      startYear: 2011,
      endYear: 2015,
      note: 'Thesis on the enterprise software development process with Scrum.',
    },
    {
      degree: 'Bachelor of Business Information Systems',
      field: 'Business Administration',
      institution: 'Satakunta University of Applied Sciences, Pori',
      startYear: 2000,
      endYear: 2004,
    },
  ],

  certifications: [{ name: 'Certified ScrumMaster®', issuer: 'Scrum Alliance', year: 2013 }],

  languages: [
    { language: 'Finnish', level: 'Native' },
    { language: 'English', level: 'Full professional' },
  ],

  projects: [
    {
      name: 'Finnish public sector information systems',
      summary: 'Helped develop several major information systems for the Finnish public sector at Gofore.',
      tags: ['.NET / C#', 'Angular', 'Software architecture'],
    },
    {
      name: 'Liquidity',
      summary:
        'Enterprise cash management solution at OpusCapita. Developer and Scrum Master, later team manager.',
      tags: ['.NET / C#', 'Scrum'],
    },
  ],
};

/** True for text that is still a `[PLACEHOLDER]`. */
export function isPlaceholder(text: string): boolean {
  return /\[[^\]]+\]/.test(text);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 'YYYY-MM' → "Mar 2022", 'YYYY' → "2022" */
function formatMonth(iso: string): string {
  const [year, month] = iso.split('-').map(Number);
  return month ? `${MONTHS[month - 1]} ${year}` : String(year);
}

/** e.g. "2016 – now" or "Mar 2022 – now" */
export function formatPeriod(role: Pick<Role, 'start' | 'end'>): string {
  return `${formatMonth(role.start)} – ${role.end ? formatMonth(role.end) : 'now'}`;
}

/** Roles flattened with their company, newest first. */
export function allRoles(cv: CvData = CV): (Role & { company: string })[] {
  return cv.experience
    .flatMap((employer) => employer.roles.map((role) => ({ ...role, company: employer.company })))
    .sort((a, b) => b.start.localeCompare(a.start));
}
