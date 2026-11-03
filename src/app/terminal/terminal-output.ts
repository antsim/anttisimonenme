import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CV, allRoles, formatPeriod, isPlaceholder } from '../data/cv.data';
import { PlaceholderText } from '../shared/placeholder-text';
import { COMMANDS, TerminalEntry } from './commands';
import { Prompt } from './prompt';
import { TerminalService } from './terminal.service';

/** Renders one command and its output inside the terminal. */
@Component({
  selector: 'app-terminal-output',
  imports: [NgTemplateOutlet, PlaceholderText, Prompt],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './terminal-output.html',
  styleUrl: './terminal-output.scss',
})
export class TerminalOutput {
  private readonly terminal = inject(TerminalService);

  readonly entry = input.required<TerminalEntry>();

  protected readonly cv = CV;
  protected readonly commands = COMMANDS;
  protected readonly roles = allRoles();
  protected readonly lastLogin = this.terminal.lastLogin;
  protected readonly rule = '─'.repeat(60);
  protected readonly pdfName = CV.pdfUrl.split('/').pop();
  protected readonly period = formatPeriod;
  protected readonly isPlaceholder = isPlaceholder;

  protected run(command: string): void {
    this.terminal.runFromUi(command);
  }

  protected more(): void {
    this.terminal.more();
    this.terminal.focusRequests.update((n) => n + 1);
  }

  protected strip(url: string): string {
    return url.replace(/^https?:\/\/(www\.)?/, '');
  }
}
