import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CV, formatPeriod, isPlaceholder } from '../../data/cv.data';
import { PlaceholderText } from '../../shared/placeholder-text';
import { SiteFooter } from '../../shared/site-footer';
import { SiteHeader } from '../../shared/site-header';

/** Plain, semantic CV for recruiters, search engines and screen readers. Prerendered, works without JS. */
@Component({
  selector: 'app-cv-page',
  imports: [RouterLink, PlaceholderText, SiteHeader, SiteFooter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cv-page.html',
  styleUrl: './cv-page.scss',
})
export class CvPage {
  protected readonly cv = CV;
  protected readonly period = formatPeriod;
  protected readonly isPlaceholder = isPlaceholder;
}
