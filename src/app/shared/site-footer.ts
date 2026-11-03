import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CV } from '../data/cv.data';

export const SITE_VERSION = 'v2026.1';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer>
      <span>© {{ year }} {{ name }}</span>
      <span>Keyboard-first · plain-HTML CV at <a routerLink="/cv">/cv</a></span>
      <span>{{ version }}</span>
    </footer>
  `,
  styles: `
    footer {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 8px 24px;
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--ink-muted);
    }
    a {
      color: inherit;
      text-underline-offset: 3px;
      &:hover {
        color: var(--link);
      }
    }
  `,
})
export class SiteFooter {
  protected readonly year = new Date().getFullYear();
  protected readonly name = CV.name;
  protected readonly version = SITE_VERSION;
}
