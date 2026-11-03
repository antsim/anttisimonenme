import { ChangeDetectionStrategy, Component } from '@angular/core';

/** `guest@anttisimonen.me:~$` on wide screens, `~$` on phones. */
@Component({
  selector: 'app-prompt',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="full"
      ><span class="user">guest&#64;anttisimonen.me</span><span class="muted">:</span><span class="path">~</span></span
    ><span class="short user">~</span><span class="muted">$&#160;</span>`,
  styles: `
    :host {
      white-space: nowrap;
    }
    .user {
      color: var(--accent);
    }
    .path {
      color: var(--blue);
    }
    .muted {
      color: var(--term-muted);
    }
    .short {
      display: none;
    }
    @media (max-width: 899px) {
      .full {
        display: none;
      }
      .short {
        display: inline;
      }
    }
  `,
})
export class Prompt {}
