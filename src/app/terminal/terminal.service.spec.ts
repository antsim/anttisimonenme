import { TestBed } from '@angular/core/testing';
import { TerminalService } from './terminal.service';

describe('TerminalService', () => {
  let terminal: TerminalService;
  const kinds = () => terminal.entries().map((e) => e.kind);
  const last = () => terminal.entries().at(-1)!;

  beforeEach(() => {
    terminal = TestBed.inject(TerminalService);
  });

  it('shows the banner and runs help on first load', () => {
    expect(kinds()).toEqual(['banner', 'help']);
    expect(terminal.activeCommand()).toBe('help');
  });

  it('reports unknown commands', () => {
    terminal.run('sudo make coffee');
    expect(last()).toMatchObject({ kind: 'not-found', input: 'sudo make coffee' });
  });

  it('normalises case and whitespace', () => {
    terminal.run('  Experience   --FULL ');
    expect(last().kind).toBe('experience-full');
    expect(terminal.activeCommand()).toBe('experience');
  });

  it('pages the CV with an empty Enter', () => {
    terminal.run('cv');
    expect(terminal.windowTitle()).toBe('~/cv');
    terminal.run('');
    expect(last().kind).toBe('cv-more');
    terminal.run('');
    expect(last().kind).toBe('empty');
  });

  it('clears the screen', () => {
    terminal.run('clear');
    expect(terminal.entries()).toEqual([]);
    expect(terminal.windowTitle()).toBe('~');
  });

  it('keeps a command history without consecutive duplicates', () => {
    terminal.run('skills');
    terminal.run('skills');
    terminal.run('contact');
    expect(terminal.historyLength).toBe(2);
    expect(terminal.historyAt(1)).toBe('contact');
    expect(terminal.historyAt(2)).toBe('skills');
    expect(terminal.historyAt(3)).toBe('');
  });

  it('autocompletes commands', () => {
    expect(terminal.complete('sk')).toBe('skills');
    expect(terminal.complete('do')).toBe('download cv');
    expect(terminal.complete('exp')).toBe('experience');
    expect(terminal.complete('xyz')).toBe('xyz');
  });

  it('lists candidates when completion is ambiguous', () => {
    expect(terminal.complete('c')).toBe('c');
    expect(last()).toMatchObject({ kind: 'completions', items: ['cv', 'contact', 'clear'] });
  });
});
