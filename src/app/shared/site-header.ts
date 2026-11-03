import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CV } from '../data/cv.data';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <a class="brand" routerLink="/" aria-label="anttisimonen.me — home">
        <span class="mark" aria-hidden="true"></span>
        <span>anttisimonen.me</span>
      </a>
      <nav aria-label="Profiles and CV">
        <a class="ext" [href]="cv.linkedinUrl" target="_blank" rel="noopener">LinkedIn ↗</a>
        <a class="ext" [href]="cv.githubUrl" target="_blank" rel="noopener">GitHub ↗</a>
        <a class="download" [href]="cv.pdfUrl" download>
          <span class="long">Download CV (PDF)</span><span class="short">CV (PDF)</span>
        </a>
      </nav>
    </header>
  `,
  styles: `
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: var(--font-mono);
      font-size: 15px;
      font-weight: 600;
      color: var(--ink);
      text-decoration: none;
    }
    .mark {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      background: var(--link);
    }
    nav {
      display: flex;
      align-items: center;
      gap: 28px;
      font-size: 15px;
    }
    .ext {
      color: var(--ink);
      text-decoration: none;
      &:hover {
        color: var(--link);
        text-decoration: underline;
        text-underline-offset: 3px;
      }
    }
    .download {
      padding: 12px 18px;
      border-radius: 8px;
      font-weight: 500;
      color: var(--page-bg);
      background: var(--ink);
      text-decoration: none;
      &:hover {
        color: var(--page-bg);
        background: #000;
      }
    }
    .short {
      display: none;
    }
    @media (max-width: 899px) {
      .brand {
        gap: 10px;
        font-size: 14px;
      }
      .mark {
        width: 10px;
        height: 10px;
      }
      .ext,
      .long {
        display: none;
      }
      .short {
        display: inline;
      }
      .download {
        padding: 12px 14px;
        font-size: 14px;
      }
    }
    @media print {
      nav {
        display: none;
      }
    }
  `,
})
export class SiteHeader {
  protected readonly cv = CV;
}
