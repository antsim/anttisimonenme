import { DOCUMENT, Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CV } from '../data/cv.data';
import { COMPLETIONS, OutputKind, TerminalEntry, commonPrefix } from './commands';

/** Commands that map one-to-one to an output block. */
const SIMPLE_COMMANDS: Record<string, OutputKind> = {
  help: 'help',
  cv: 'cv',
  whoami: 'whoami',
  experience: 'experience',
  'experience --full': 'experience-full',
  skills: 'skills',
  projects: 'projects',
  contact: 'contact',
};

/**
 * Terminal state shared by the terminal window and the quick-command chips.
 * Provided in root so history survives navigating to /cv and back.
 */
@Injectable({ providedIn: 'root' })
export class TerminalService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private nextId = 0;
  private readonly history: string[] = [];
  private cvHasMore = false;

  readonly entries = signal<TerminalEntry[]>([]);
  /** Base command whose output is currently on screen (drives chip state and the window title). */
  readonly activeCommand = signal<string | null>(null);
  readonly windowTitle = computed(() => (this.activeCommand() === 'cv' ? '~/cv' : '~'));
  /** Incremented when something outside the terminal wants it to take focus. */
  readonly focusRequests = signal(0);
  /** "Last login" timestamp in the banner; set in the browser only, after hydration. */
  readonly lastLogin = signal<string | null>(null);

  constructor() {
    // Run `help` on first load so the terminal never looks empty.
    this.push(null, 'banner');
    this.run('help', { record: false });
  }

  /** Run a command line as if typed. */
  run(raw: string, options: { record?: boolean } = {}): void {
    const input = raw.trim().replace(/\s+/g, ' ');
    const command = input.toLowerCase();

    if (input && options.record !== false && this.history.at(-1) !== input) {
      this.history.push(input);
    }

    if (!command) {
      if (this.cvHasMore) {
        this.more();
      } else {
        this.push('', 'empty');
      }
      return;
    }

    this.cvHasMore = false;

    if (command === 'clear') {
      this.entries.set([]);
      this.activeCommand.set(null);
      return;
    }

    if (command === 'download cv' || command === 'download') {
      this.push(input, 'download');
      this.downloadCv();
      return;
    }

    const kind = SIMPLE_COMMANDS[command];
    if (!kind) {
      this.push(input, 'not-found');
      return;
    }

    this.push(input, kind);
    this.activeCommand.set(command.split(' ')[0]);
    this.cvHasMore = kind === 'cv';
  }

  /** Show the second page of the CV. */
  more(): void {
    this.cvHasMore = false;
    this.push(null, 'cv-more');
    this.activeCommand.set('cv');
  }

  /** Run a command from a chip or link and hand focus back to the terminal. */
  runFromUi(command: string): void {
    this.run(command);
    this.focusRequests.update((n) => n + 1);
  }

  /** Command at `offset` steps back in history (1 = most recent), or '' past either end. */
  historyAt(offset: number): string {
    return offset > 0 && offset <= this.history.length ? this.history[this.history.length - offset] : '';
  }

  get historyLength(): number {
    return this.history.length;
  }

  /**
   * Tab completion. Returns the new input value; prints the candidates
   * when the input is ambiguous and cannot be extended any further.
   */
  complete(value: string): string {
    const typed = value.replace(/^\s+/, '').toLowerCase();
    if (!typed) return value;

    const matches = COMPLETIONS.filter((c) => c.startsWith(typed));
    if (matches.length === 1) return matches[0];
    if (!matches.length) return value;

    const prefix = commonPrefix(matches);
    if (prefix.length > typed.length) return prefix;

    this.push(value, 'completions', matches);
    return value;
  }

  private push(input: string | null, kind: OutputKind, items?: string[]): void {
    this.entries.update((entries) => [...entries, { id: this.nextId++, input, kind, items }]);
  }

  private downloadCv(): void {
    if (!this.isBrowser) return;
    const link = this.document.createElement('a');
    link.href = CV.pdfUrl;
    link.download = CV.pdfUrl.split('/').pop() ?? 'cv.pdf';
    this.document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
