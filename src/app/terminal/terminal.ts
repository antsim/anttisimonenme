import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MOBILE_QUICK_COMMANDS } from './commands';
import { Prompt } from './prompt';
import { TerminalOutput } from './terminal-output';
import { TerminalService } from './terminal.service';

@Component({
  selector: 'app-terminal',
  imports: [Prompt, TerminalOutput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './terminal.html',
  styleUrl: './terminal.scss',
})
export class Terminal {
  protected readonly terminal = inject(TerminalService);
  private readonly injector = inject(Injector);

  private readonly body = viewChild.required<ElementRef<HTMLElement>>('body');
  private readonly inlineInput = viewChild<ElementRef<HTMLInputElement>>('inlineInput');
  private readonly mobileInput = viewChild<ElementRef<HTMLInputElement>>('mobileInput');

  protected readonly mobileCommands = MOBILE_QUICK_COMMANDS;
  protected readonly value = signal('');
  protected readonly caret = signal(0);
  protected readonly focused = signal(false);

  /** Typed text split around the block cursor. */
  protected readonly beforeCaret = computed(() => this.value().slice(0, this.caret()));
  protected readonly underCaret = computed(() => this.value().charAt(this.caret()) || ' ');
  protected readonly afterCaret = computed(() => this.value().slice(this.caret() + 1));

  /** Steps back into history; 0 = the line being typed. */
  private historyOffset = 0;
  private draft = '';

  constructor() {
    afterNextRender(() => {
      this.terminal.lastLogin.set(formatLastLogin(new Date()));
      if (isWideLayout()) this.focusInput();
      this.scrollToLatest();
    });

    // Scroll new output into view.
    effect(() => {
      this.terminal.entries();
      afterNextRender({ write: () => this.scrollToLatest() }, { injector: this.injector });
    });

    // Chips and clickable commands hand focus back to the terminal
    // (not on phones, where focusing would pop up the on-screen keyboard).
    effect(() => {
      if (this.terminal.focusRequests() > 0 && isWideLayout()) {
        afterNextRender({ write: () => this.focusInput() }, { injector: this.injector });
      }
    });
  }

  protected onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('button, a, input')) return;
    // Let people select and copy output text.
    if (window.getSelection()?.toString()) return;
    this.focusInput();
  }

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.syncCaret(input);
    this.historyOffset = 0;
  }

  protected syncCaret(input: HTMLInputElement): void {
    this.caret.set(input.selectionStart ?? input.value.length);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        this.submit(input);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.browseHistory(input, 1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.browseHistory(input, -1);
        break;
      case 'Tab':
        if (!input.value.trim()) return; // let Tab move focus out of an empty prompt
        event.preventDefault();
        this.setValue(input, this.terminal.complete(input.value));
        break;
      case 'l':
        if (event.ctrlKey) {
          event.preventDefault();
          this.terminal.run('clear', { record: false });
        }
        break;
    }
  }

  protected runQuick(command: string): void {
    this.terminal.run(command);
  }

  private submit(input: HTMLInputElement): void {
    const line = input.value;
    this.setValue(input, '');
    this.historyOffset = 0;
    this.draft = '';
    this.terminal.run(line);
  }

  private browseHistory(input: HTMLInputElement, step: 1 | -1): void {
    const next = this.historyOffset + step;
    if (next < 0 || next > this.terminal.historyLength) return;
    if (this.historyOffset === 0) this.draft = input.value;
    this.historyOffset = next;
    this.setValue(input, next === 0 ? this.draft : this.terminal.historyAt(next));
  }

  private setValue(input: HTMLInputElement, value: string): void {
    input.value = value;
    input.setSelectionRange(value.length, value.length);
    this.value.set(value);
    this.caret.set(value.length);
  }

  /** Focus whichever input is visible at the current breakpoint. */
  private focusInput(): void {
    const candidates = [this.inlineInput(), this.mobileInput()];
    const visible = candidates.find((ref) => ref && ref.nativeElement.offsetParent !== null);
    visible?.nativeElement.focus({ preventScroll: true });
  }

  /** Show the latest output: from its first line if it is taller than the terminal, otherwise scroll to the bottom. */
  private scrollToLatest(): void {
    const body = this.body().nativeElement;
    const last = body.querySelector<HTMLElement>('app-terminal-output:last-of-type');
    if (last && last.offsetHeight > body.clientHeight * 0.8) {
      body.scrollTop = last.offsetTop - 16;
    } else {
      body.scrollTop = body.scrollHeight;
    }
  }
}

/** Desktop layout, where the inline prompt takes keyboard input. */
function isWideLayout(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 900px)').matches;
}

/** e.g. "Wed Sep 30 10:12:04 2026" */
function formatLastLogin(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const pad = (n: number) => String(n).padStart(2, '0');
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  return `${days[date.getDay()]} ${months[date.getMonth()]} ${pad(date.getDate())} ${time} ${date.getFullYear()}`;
}
